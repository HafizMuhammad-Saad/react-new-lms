import React from 'react'
import { useParams } from 'react-router'

function LoanDetail() {
    const {id} = useParams()
  return (
    <div>
      Loan Detail for ID: {id}
    </div>
  )
}

export default LoanDetail
