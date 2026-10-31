# Native CRO checkout

Production configuration is scoped only to gaia-lumen-originale:
GAIA_CRO_ENABLED=true and GAIA_CRO_RECEIVER (the owner's confirmed public
Crypto.com Cronos EVM deposit address). Preview is disabled by default.
Existing Neon DATABASE_URL/POSTGRES_URL backs a dedicated gaia_cro_orders table;
there is no file/memory fallback. No private key or wallet password is stored.
No new provider, subscription, wallet account or smart contract is provisioned.
The price is 5 native CRO, integer 5000000000000000000 base units, plus gas.

Product: topic-filtered automatic compilation of up to 30 available public
bulletins into TXT, not human analysis or financial/medical advice. The input
information remains free in the dashboard. The report is generated and saved
before the order can be paid, so fulfillment does not depend on future AI calls.
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
receipt, canonical block hash and 15 confirmations. A unique tx_hash constraint
and order reference prevent one payment redeeming several orders. Paid status
is durable and settlement idempotent. Public RPC https://evm.cronos.org is read
only; node errors fail closed. Temporary errors never trigger automatic resend.
An uncertain wallet send disables resending; recover hash from wallet and verify.
Chain confirmation is not proof of internal exchange credit. The merchant must
keep the receiving exchange address valid and observe its deposit requirements.

API: GET /api/cro/config; POST /api/cro/order, /verify, /resume, /report.
Order access uses a random 256-bit bearer reference (only SHA256 stored server
side). References travel in POST bodies, not URLs; all API responses no-store.
Session storage supports reload; explicit JSON backup/restore supports recovery
after closing a tab. Keep this file private: it permits report retrieval but
cannot sign transactions. No seed/key request, card purchase, custodial balance,
swap or automatic spending. Confirmation and signing always belong to the buyer.
No real payment is made during development or verification.

Tests: node scripts/cro-payments-test.mjs, npm run check, npm run smoke.
Production smoke checks config, durable order creation/resume, denial of unpaid
report access and rejection of invalid transaction hashes. A real wallet-funded
end-to-end payment remains untested until the owner/customer explicitly performs
one; do not claim receiving money or a paid report without that evidence.
