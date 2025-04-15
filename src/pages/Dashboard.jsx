import React from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router';


function Dashboard() {
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalLoans: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    rejectedLoans: 0,
  });

  useEffect(() => {
    fetchLoanStats();
  }, []);

  const fetchLoanStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      
      // Fetch all loan requests for the current user
      const { data: loans, error } = await supabase
        .from('loan_requests')
        .select('*')
        .eq('user_id', user.id);
        

      if (error) throw error;

      // Calculate statistics
      const totalLoans = loans.length;
      const pendingLoans = loans.filter(loan => loan.status === 'pending').length;
      const approvedLoans = loans.filter(loan => loan.status === 'approved').length;
      const rejectedLoans = loans.filter(loan => loan.status === 'rejected').length;

      setStats({
        totalLoans,
        pendingLoans,
        approvedLoans,
        rejectedLoans,
      });
    } catch (error) {
      setError('Failed to fetch loan statistics');
      console.error('Error fetching loan stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StateCard = ({ icon, color, value, title }) => {
    return (
      <Container style={{ border: `2px solid ${color}`, padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
        <Row>
          <Col>{icon}</Col>
          <Col>
            <h5>{title}</h5>
          </Col>
          <Col>
            <strong>{value}</strong>
          </Col>
        </Row>
      </Container>
    );
  };
  if (loading) {
    return (
        <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }
  if (error) {
    <Alert variant={'danger'}> {error} </Alert>
  }
  return (
    <Container>
    <Row>
      <Col>
        <StateCard
          icon="📊"
          color="blue"
          title="Total Loans"
          value={stats.totalLoans}
        />
      </Col>
      <Col>
        <StateCard
          icon="⏳"
          color="orange"
          title="Pending Loans"
          value={stats.pendingLoans}
        />
      </Col>
      <Col>
        <StateCard
          icon="✅"
          color="green"
          title="Approved Loans"
          value={stats.approvedLoans}
        />
      </Col>
      <Col>
        <StateCard
          icon="❌"
          color="red"
          title="Rejected Loans"
          value={stats.rejectedLoans}
        />
      </Col>
    </Row>
    <Link to="/createloan">Create New Loan</Link>
  </Container>
  )
}

export default Dashboard
