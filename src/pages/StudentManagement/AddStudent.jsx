import React from 'react';
import Button from '../../components/Button';
import Sidebar from '../../components/Sidebar';
import APIService from "../../services/APIService";
import TopHeader from '../../components/TopHeader';

import { Link } from 'react-router-dom';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

const AddStudent = () => {
    
    const onSubmit = async () => {
        // 1.) Validations on Required Field
    
        // Check if "name" is provided
        if (!name) {
          toast.warn('Student Name is required');
          return; // Don't proceed if it is not provided
        }
    
        // Check if "name" follows a valid format
        const namePattern = /^[a-zA-Z .]{2,50}$/;
        if (!namePattern.test(name)) {
          toast.warn('Please enter a valid Student Name');
          return; // Don't proceed if it doesn't match the pattern
        }
    
        // Check if "DOB" is provided and follows a valid date format
        if (!DOB || !isDate(new Date(DOB))) {
          toast.warn('Please enter a valid Date of Birth.');
          return; // Don't proceed if it's not a valid date
        }
    
        // Do not allow student under age 5 years from now
        if (subYears(new Date(), 5) < new Date(DOB)) {
          return toast.warn('Student less than 5 years are not allowed');
        }
    
        // Do not allow future students
        if (new Date(DOB) > new Date()) {
          return toast.warn('Future date of birth are not allowed');
        }
    
        // Calculate the current date
        const currentDate = new Date();
    
        // Calculate the maximum allowed date (100 years and 1 day ago from today)
        const maxAllowedDOB = new Date();
        maxAllowedDOB.setFullYear(currentDate.getFullYear() - 100);
        maxAllowedDOB.setDate(currentDate.getDate() - 1);
    
        if (new Date(DOB) > currentDate || new Date(DOB) < maxAllowedDOB) {
          return toast.warn('Student cannot be older than 100 years');
        }
    
        // Check if "gender" is provided and not empty
        if (!gender) {
          toast.warn('Student Gender is required.');
          return; // Don't proceed if it's empty
        }
    
        // Check if "local address" is provided and not empty
        if (!localAddress) {
          toast.warn('Student Current Address is required.');
          return; // Don't proceed if it's empty
        }
    
        // Check if "permanent address" is provided and not empty
        if (!permanentAddress) {
          toast.warn('Student Permanent Address is required.');
          return; // Don't proceed if it's empty
        }
    
        // Check if "email" is provided
        if (!email) {
          toast.warn('Student Email is required');
          return; // Don't proceed if it is not provided
        }
    
        // Check if "email" follows a valid format
        const validEmailRegEx = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!validEmailRegEx.test(email)) {
          toast.warn('Student Email is invalid');
          return; // Don't proceed if it doesn't match the pattern
        }
    
        // Check if "phone1" is provided and not empty
        if (!phone1) {
          toast.warn('Student Phone 1 is required.');
          return; // Don't proceed if it's empty
        }
    
        //  Check if phone1 is valid
        const validMobileRegex = /^[6-9]\d{9}$/;
        if (!validMobileRegex.test(phone1)) return toast.warn("Student's Phone 1 is invalid");
    
        //  Check if phone2 exists and is valid
        if (phone2 && !validMobileRegex.test(phone2)) return toast.warn(" Student's Phone 2 is invalid");
    
        // Check if "guardianName" is provided
        if (!guardianName) {
          toast.warn('Parent/Guardian Name is required');
          return; // Don't proceed if it is not provided
        }
    
        // Check if "guardianName" follows a valid format
        if (!namePattern.test(guardianName)) {
          toast.warn('Please enter a valid Parent/Guardian Name');
          return; // Don't proceed if it doesn't match the pattern
        }
    
        // Check if "Relation" is provided
        if (!relation) {
          toast.warn('Parent/Guardian Relation is required');
          return; // Don't proceed if it is not provided
        }
    
        // Check if "Parent/Guardian Gender" is provided and not empty
        if (!guardianGender) {
          toast.warn('Parent/Guardian Gender is required.');
          return; // Don't proceed if it's empty
        }
    
        // Check if "Parent/Guardian Current" is provided and not empty
        if (!guardianAddress) {
          toast.warn('Parent/Guardian Current Address is required.');
          return; // Don't proceed if it's empty
        }
    
        // Check if "Parent/Guardian Email" is provided
        if (!guardianEmail) {
          toast.warn('Parent/Guardian Email is required');
          return; // Don't proceed if it is not provided
        }
    
        // Check if "Parent/Guardian Email" follows a valid format
        if (!validEmailRegEx.test(guardianEmail)) {
          toast.warn('Parent/Guardian Email is invalid');
          return; // Don't proceed if it doesn't match the pattern
        }
    
        // Check if "Parent/Guardian Phone No." is provided and not empty
        if (!guardianPhone) {
          toast.warn('Parent/Guardian Phone No. is required.');
          return; // Don't proceed if it's empty
        }
    
        //  Check if Parent/Guardian Phone No. is valid
        if (!validMobileRegex.test(guardianPhone)) return toast.warn('Parent/Guardian Phone No. is invalid');
    
        // Check if "batchId" is provided and not empty
        if (!formData.batchId) {
          toast.warn('Select a Batch.');
          return; // Don't proceed if it's empty
        }
    
        // Check if "DOB" is provided and follows a valid date format
        if (!dateOfAdmission || !isDate(new Date(dateOfAdmission))) {
          toast.warn('Please enter a valid Date of Birth.');
          return; // Don't proceed if it's not a valid date
        }
    
        //  Check if Future date of admissions
        if (new Date(dateOfAdmission) > new Date()) {
          return toast.warn('Future date of admission are not allowed');
        }
    
        // Check if "Parent/Guardian Phone No." is provided and not empty
        if (!paymentPlan) {
          toast.warn('Please select a Payment Plan.');
          return; // Don't proceed if it's empty
        }
    
        //2.7 Check if totalFees is a number
        if (isNaN(totalFees)) {
          return toast.warn('Total Fees must be a number');
        }
    
        // 2.8) Check if paid fees and total fees are available, then paid fees should not be more than total fees
        totalFees = totalFees * 1;
        paidFees = paidFees * 1;
        if (totalFees || paidFees) {
          console.log({ totalFees, paidFees });
          if (totalFees < paidFees) return toast.warn('Paid fees cannot be more than total fees');
          if (discount * 1) {
            const totalDiscount = (parseInt(totalFees) * parseInt(discount)) / 100;
            if (totalDiscount + paidFees > totalFees)
              return toast.warn('Sum of paid fees and discounted fees cannot be more than total fees');
          }
        }
    
        // if total fees is 0 show confirmation alert
        if (!totalFees) {
          const confirmZeroFees = window.confirm('Are you sure Total fees would be zero?');
          if (!confirmZeroFees) {
            return; // User clicked "No," prevent further submission
          }
        }
    
        const payload = {};
        payload.userDetails = {
          name,
          DOB,
          gender: formData.gender,
          email,
          phone1,
          phone2,
          localAddress,
          permanentAddress
        };
        payload.guardianDetails = {
          name: guardianName,
          relation,
          gender: formData.guardianGender,
          address: guardianAddress,
          email: guardianEmail,
          phone: guardianPhone
        };
        payload.academicDetails = {
          batchId: formData.batchId * 1,
          batchCode: batches.find(item => item.id === parseInt(formData.batchId)).batchCode,
          dateOfAdmission
        };
        payload.accountDetails = {
          paymentPlan,
          totalFees: totalFees * 1,
          paidFees: paidFees * 1,
          discount: discount ? discount : 0,
          pdcDetails
        };
    
        // Hit the APIs
        await addNewFStudent(payload);
      };

    const clearFormData = () => {
    const clearedForm = {};
    for (const key in formData) {
        if (key === 'DOB') {
        clearFormData[key] = format(subYears(new Date(), 5), 'yyyy-MM-dd');
        continue;
        }
        if (key === 'dateOfAdmission') {
        clearFormData[key] = format(new Date(), 'yyyy-MM-dd');
        continue;
        }
        clearedForm[key] = '';
    }
    setFormData(clearedForm);
    };

    return (
        <>
            <div className='main-page'>
              <div>
                    <Sidebar />
              </div>
              <div className='main-page-content'>
                  <TopHeader />
                  <main className='main'>
                      <div className='main-grid'>
                          <div className='page-content'>

                              {/* TOP CARD  */}
                              <div className='top-card h-[800px]'>
                                  <div className='card-content'>
                                      <div className='card-header'>Add Student</div>
                                      <div>
                                          <Link to='/student-management'>
                                              <Button style="small">
                                                  <KeyboardBackspaceRoundedIcon className='icons mr-1' />
                                                  Back
                                              </Button>
                                          </Link>
                                      </div>
                                  </div>
                                  <div class="flex justify-start">
                                      <Button style='small' onClick={onSubmit}>Save</Button>
                                      
                                      <Link to="/student-management">
                                      <Button style='cancle' onClick={clearFormData}>Cancel</Button>
                                      </Link>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </main>
              </div>
            </div>
        </>
    )
}

export default AddStudent