import { useCallback, useState } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { ApprovedState } from "./types"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const [approved, setApproved] = useState<ApprovedState>({})
  const { fetchWithoutCache, loading } = useCustomFetch()

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
    },
    [fetchWithoutCache]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          id={transaction.id}
          transaction={transaction}
          loading={loading}
          checked={approved ? approved[transaction.id] : transaction.approved}
          onChange={async (newValue: any) => {
            await setTransactionApproval({
              transactionId: transaction.id,
              newValue,
            })
            setApproved({
              ...approved,
              ...(approved ? { [transaction.id]: !approved[transaction.id] } : null),
            })
          }}
        />
      ))}
    </div>
  )
}
