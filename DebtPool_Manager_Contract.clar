;; DebtPool Manager Contract
;; Multi-collateral debt position platform with automated liquidation protection
;; and cross-margin capabilities

;; Define the contract constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-amount (err u101))
(define-constant err-insufficient-collateral (err u102))
(define-constant err-position-not-found (err u103))
(define-constant err-liquidation-threshold-breach (err u104))
(define-constant err-invalid-collateral-ratio (err u105))

;; Constants for liquidation and collateral management
(define-constant min-collateral-ratio u150) ;; 150% minimum collateral ratio
(define-constant liquidation-threshold u120) ;; 120% liquidation threshold
(define-constant liquidation-penalty u10) ;; 10% liquidation penalty

;; Data structures
(define-map debt-positions 
  principal 
  {
    collateral-amount: uint,
    debt-amount: uint,
    collateral-type: (string-ascii 10),
    last-update: uint,
    is-active: bool
  })

(define-map collateral-types
  (string-ascii 10)
  {
    price-feed: uint,
    liquidation-ratio: uint,
    max-debt-ratio: uint,
    is-enabled: bool
  })

;; Global state variables
(define-data-var total-collateral uint u0)
(define-data-var total-debt uint u0)
(define-data-var liquidation-pool uint u0)

;; Initialize supported collateral types
(map-set collateral-types "STX" 
  {
    price-feed: u100, ;; $1.00 base price (in cents)
    liquidation-ratio: u120,
    max-debt-ratio: u80,
    is-enabled: true
  })

;; Function 1: Create or Update Debt Position
;; This function allows users to create a new debt position or update existing one
;; with multi-collateral support and automated liquidation protection
(define-public (create-debt-position 
                (collateral-amount uint) 
                (debt-amount uint) 
                (collateral-type (string-ascii 10)))
  (let (
    (existing-position (map-get? debt-positions tx-sender))
    (collateral-config (unwrap! (map-get? collateral-types collateral-type) err-invalid-amount))
    (collateral-value (* collateral-amount (get price-feed collateral-config)))
    (required-collateral (* debt-amount min-collateral-ratio))
    (current-block-height stacks-block-height)
  )
    ;; Validate inputs
    (asserts! (> collateral-amount u0) err-invalid-amount)
    (asserts! (> debt-amount u0) err-invalid-amount)
    (asserts! (get is-enabled collateral-config) err-invalid-amount)
    
    ;; Check collateral ratio requirement
    (asserts! (>= (* collateral-value u100) required-collateral) err-insufficient-collateral)
    
    ;; Handle existing position update or new position creation
    (match existing-position
      current-pos
      (begin
        ;; Update existing position with cross-margin calculation
        (let (
          (new-collateral (+ (get collateral-amount current-pos) collateral-amount))
          (new-debt (+ (get debt-amount current-pos) debt-amount))
          (total-collateral-value (* new-collateral (get price-feed collateral-config)))
        )
          ;; Ensure updated position maintains safe collateral ratio
          (asserts! (>= (* total-collateral-value u100) (* new-debt min-collateral-ratio)) 
                   err-insufficient-collateral)
          
          ;; Update position
          (map-set debt-positions tx-sender {
            collateral-amount: new-collateral,
            debt-amount: new-debt,
            collateral-type: collateral-type,
            last-update: current-block-height,
            is-active: true
          })
          
          ;; Update global counters
          (var-set total-collateral (+ (var-get total-collateral) collateral-amount))
          (var-set total-debt (+ (var-get total-debt) debt-amount))
        ))
      
      ;; Create new position
      (begin
        (map-set debt-positions tx-sender {
          collateral-amount: collateral-amount,
          debt-amount: debt-amount,
          collateral-type: collateral-type,
          last-update: current-block-height,
          is-active: true
        })
        
        ;; Update global counters
        (var-set total-collateral (+ (var-get total-collateral) collateral-amount))
        (var-set total-debt (+ (var-get total-debt) debt-amount))
      ))
    
    (ok {
      position-id: tx-sender,
      collateral-amount: collateral-amount,
      debt-amount: debt-amount,
      collateral-ratio: (/ (* collateral-value u100) debt-amount),
      status: "position-created"
    })))