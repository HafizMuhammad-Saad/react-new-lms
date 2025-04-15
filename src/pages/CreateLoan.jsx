import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Alert,
  } from '@mui/material';
  import { supabase } from '../services/supabase';

  const steps = ['Personal Information', 'Loan Details', 'Document Upload', 'Review & Submit'];


function CreateLoan() {
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        // Personal Information
        fullName: '',
        email: '',
        phone: '',
        address: '',
        
        // Loan Details
        amount: '',
        purpose: '',
        term: '',
        
        // Document Upload
        idProof: null,
        incomeProof: null,
        addressProof: null,
      });
    
      const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
      };
    
      const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
      };
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    
      const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: files[0],
        }));
      };
    
      const handleSubmit = async () => {
        try {
          setLoading(true);
          setError('');
    
          const { data: { user } } = await supabase.auth.getUser();
    
          // Upload documents to Supabase Storage
          const documentUploads = await Promise.all([
            uploadDocument(formData.idProof, 'id-proof'),
            uploadDocument(formData.incomeProof, 'income-proof'),
            uploadDocument(formData.addressProof, 'address-proof'),
          ]);
    
          // Create loan request
          const { error: loanError } = await supabase
            .from('loan_requests')
            .insert({
              user_id: user.id,
              full_name: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              amount: parseFloat(formData.amount),
              purpose: formData.purpose,
              term: parseInt(formData.term),
              id_proof_url: documentUploads[0],
              income_proof_url: documentUploads[1],
              address_proof_url: documentUploads[2],
              status: 'pending',
            });
    
          if (loanError) throw loanError;
    
          navigate('/loanrequests');
        } catch (error) {
          setError('Failed to submit loan request. Please try again.');
          console.error('Error submitting loan:', error);
        } finally {
          setLoading(false);
        }
      };
    
      const uploadDocument = async (file, type) => {
        if (!file) return null;
    
        const fileExt = file.name.split('.').pop();
        const fileName = `${type}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;
    
        const { error: uploadError } = await supabase.storage
          .from('loan-documents')
          .upload(filePath, file);
    
        if (uploadError) throw uploadError;
    
        const { data: { publicUrl } } = supabase.storage
          .from('loan-documents')
          .getPublicUrl(filePath);
    
        return publicUrl;
      };

      const renderStepContent = (step) => {
        switch (step) {
          case 0:
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  required
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                <TextField
                  required
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <TextField
                  required
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <TextField
                  required
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Box>
            );
          case 1:
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  required
                  label="Loan Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
                <FormControl fullWidth>
                  <InputLabel>Loan Purpose</InputLabel>
                  <Select
                    name="purpose"
                    value={formData.purpose}
                    label="Loan Purpose"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="home">Home Loan</MenuItem>
                    <MenuItem value="car">Car Loan</MenuItem>
                    <MenuItem value="education">Education Loan</MenuItem>
                    <MenuItem value="personal">Personal Loan</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Loan Term (months)</InputLabel>
                  <Select
                    name="term"
                    value={formData.term}
                    label="Loan Term (months)"
                    onChange={handleInputChange}
                  >
                    <MenuItem value={12}>12 months</MenuItem>
                    <MenuItem value={24}>24 months</MenuItem>
                    <MenuItem value={36}>36 months</MenuItem>
                    <MenuItem value={48}>48 months</MenuItem>
                    <MenuItem value={60}>60 months</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            );
          case 2:
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<input type="file" hidden name="idProof" onChange={handleFileChange} />}
                >
                  Upload ID Proof
                </Button>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<input type="file" hidden name="incomeProof" onChange={handleFileChange} />}
                >
                  Upload Income Proof
                </Button>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<input type="file" hidden name="addressProof" onChange={handleFileChange} />}
                >
                  Upload Address Proof
                </Button>
              </Box>
            );
          case 3:
            return (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Review Your Application
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography><strong>Full Name:</strong> {formData.fullName}</Typography>
                  <Typography><strong>Email:</strong> {formData.email}</Typography>
                  <Typography><strong>Phone:</strong> {formData.phone}</Typography>
                  <Typography><strong>Address:</strong> {formData.address}</Typography>
                  <Typography><strong>Loan Amount:</strong> ${formData.amount}</Typography>
                  <Typography><strong>Purpose:</strong> {formData.purpose}</Typography>
                  <Typography><strong>Term:</strong> {formData.term} months</Typography>
                </Box>
              </Paper>
            );
          default:
            return null;
        }
      };
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {renderStepContent(activeStep)}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        {activeStep !== 0 && (
          <Button onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default CreateLoan
