# Native CRO checkout

Production configuration is scoped only to gaia-lumen-originale:
GAIA_CRO_ENABLED=true, GAIA_CRO_RECEIVER (the owner's confirmed public
Crypto.com Cronos EVM deposit address), GAIA_CRO_ORDER_KEY (32 random bytes,
sensitive env). Preview is disabled by default. The order key is not a wallet
private key. Preserve it: existing references require it for recovery.
The existing Neon project returned quota-exceeded HTTP 402 during live testing.
CRO checkout therefore uses authenticated encrypted references and on-chain
verification, independently of the unavailable database or file/memory fallback.
No wallet private key or wallet password is stored.
No new provider, subscription, wallet account or smart contract is provisioned.
The price is 5 native CRO, integer 5000000000000000000 base units, plus gas.

Product: topic-filtered automatic compilation of up to 30 available public
bulletins into TXT, not human analysis or financial/medical advice. The input
information remains free in the dashboard. The report is generated and saved
in the encrypted reference before the order can be paid, so fulfillment does
not depend on future AI calls. Report text is bounded to 18KB.
Sources marked stale are excluded. No usable bulletins means no order.

Flow: connect injected EIP-1193 wallet, create order, save private reference,
review recipient/price/network, authorize eth_sendTransaction in wallet, verify
on server, download report. The client cannot declare a payment successful.
Cronos chain 25 is checked on client and server. The receiver must be EOA.
The native transfer includes order-specific input data (GaiaLumen:UUID), not a
token approval. Never substitute an ordinary transfer without this reference.
Crypto.com App receives merchant deposits but is not an injected web wallet;
customers use a compatible wallet extension or wallet dapp browser.

Server checks hash, sender, receiver, exact amount and order reference, successful
receipt, canonical block hash and 15 confirmations. The order reference binds
one payment to exactly one invoice; re-downloads of that invoice are allowed.
Every download rechecks the chain, even after client paid status or server
restarts. Public RPC https://evm.cronos.org is read
only; node errors fail closed. Temporary errors never trigger automatic resend.
An uncertain wallet send disables resending; recover hash from wallet and verify.
Chain confirmation is not proof of internal exchange credit. The merchant must
keep the receiving exchange address valid and observe its deposit requirements.

API: GET /api/cro/config; POST /api/cro/order, /verify, /resume, /report.
An order's report, payer, receiver, exact amount, UUID and date are compressed
and encrypted/authenticated with AES-256-GCM, a fresh 96-bit IV and versioned
AAD. Clients cannot read the report or alter the invoice before verification.
References are bounded to 12KB. Decompression happens only after authentication,
bounded to 24KB. References travel in POST bodies, not URLs; responses no-store.
Session storage supports reload; explicit JSON backup/restore supports recovery
after closing a tab. Save reference before Pay is enabled, and keep it with the
transaction hash. Losing the reference loses report access; the UI states this
before spending. Keep the file private: it permits report retrieval but cannot
sign transactions. No seed/key request, card purchase, custodial balance,
swap or automatic spending. Confirmation and signing always belong to the buyer.
No real payment is made during development or verification.

Tests: node scripts/cro-payments-test.mjs, npm run check, npm run smoke.
Production smoke checks config, encrypted order creation/resume, tamper rejection,
denial of unpaid report access and rejection of invalid hashes. A real wallet-funded
end-to-end payment remains untested until the owner/customer explicitly performs
one; do not claim receiving money or a paid report without that evidence.
