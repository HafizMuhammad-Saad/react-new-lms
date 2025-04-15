import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Table from 'react-bootstrap/Table';


import { supabase } from '../services/supabase';



function LoanRequests() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchLoans();
      }, []);
    
      const fetchLoans = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          const { data, error } = await supabase
            .from('loan_requests')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
                
          if (error) throw error;
          setLoans(data || []);
        } catch (error) {
          setError('Failed to fetch loan requests');
          console.error('Error fetching loans:', error);
        } finally {
          setLoading(false);
        }
      };

      const handleViewLoan = (loanId) => {
        navigate(`/loanrequests/${loanId}`);
      };
    
      if (loading) {
        return (
          "Loading..."
        );
      }
    
      if (error) {
        return (
          <Alert variant={'danger'}>
            {error}
          </Alert>
        );
      }
  return (
    <div className="table-responsive" style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
    <Table hover striped style={{ marginBottom: 0 }}>
      <thead style={{ backgroundColor: '#f8f9fa', position: 'sticky', top: 0 }}>
        <tr>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Loan ID</th>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Amount</th>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Purpose</th>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Created At</th>
          <th style={{ padding: '1rem', fontWeight: 600 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {loans.map((loan) => (
          <tr key={loan.id} style={{ transition: 'background-color 0.2s' }}>
            <td style={{ padding: '1rem', fontFamily: 'monospace' }}>#{loan.id}</td>
            <td style={{ padding: '1rem', fontWeight: 500 }}>
              ₹{loan.amount.toLocaleString('en-PK')}
            </td>
            <td style={{ padding: '1rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {loan.purpose}
            </td>
            <td style={{ padding: '1rem' }}>
              <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: {
                  pending: '#fff3cd',
                  approved: '#d4edda',
                  rejected: '#f8d7da'
                }[loan.status.toLowerCase()],
                color: {
                  pending: '#856404',
                  approved: '#155724',
                  rejected: '#721c24'
                }[loan.status.toLowerCase()]
              }}>
                {loan.status}
              </span>
            </td>
            <td style={{ padding: '1rem' }}>
              {new Date(loan.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </td>
            <td style={{ padding: '1rem' }}>
              <button 
                className="btn btn-link text-primary p-0"
                onClick={() => handleViewLoan(loan.id)}
                style={{ textDecoration: 'none' }}
                aria-label={`View loan ${loan.id}`}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Details
                </span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    {loans.length === 0 && (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>
        No loans found
      </div>
    )}
  </div>
  )
}

export default LoanRequests
