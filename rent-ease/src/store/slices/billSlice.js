import { createSlice } from '@reduxjs/toolkit';

// Helper function to get initial bills from localStorage
const getInitialBills = () => {
  try {
    const item = localStorage.getItem('bills');
    const bills = item ? JSON.parse(item) : [];
    // Ensure each bill has a payments array
    return bills.map(bill => ({
      ...bill,
      payments: bill.payments || [], // Initialize if missing
    }));
  } catch (error) {
    console.error('Error loading bills from localStorage:', error);
    return [];
  }
};

// Helper function to save bills to localStorage
const saveBillsToLocalStorage = (bills) => {
  try {
    localStorage.setItem('bills', JSON.stringify(bills));
  } catch (error) {
    console.error('Error saving bills to localStorage:', error);
  }
};

const initialState = {
  bills: getInitialBills(),
  loading: false,
  error: null,
};

const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    addBill: (state, action) => {
      const newBill = { 
        ...action.payload, 
        id: `bill_${Date.now().toString()}_${Math.random().toString(36).substr(2, 9)}`,
        payments: [], // Initialize payments array for new bills
        // Ensure other fields like otherCharges are initialized if not provided
        otherCharges: action.payload.otherCharges || [],
      };
      state.bills.push(newBill);
      saveBillsToLocalStorage(state.bills);
    },
    // Enhanced updateBill or a new recordPaymentOnBill reducer
    recordPaymentOnBill: (state, action) => {
      const { billId, paymentData } = action.payload;
      const billIndex = state.bills.findIndex(b => b.id === billId);

      if (billIndex !== -1) {
        const bill = state.bills[billIndex];
        const newPayment = {
          ...paymentData,
          paymentId: `pay_${Date.now().toString()}_${Math.random().toString(36).substr(2, 9)}`,
          recordedAt: new Date().toISOString(),
        };
        
        bill.payments = bill.payments || []; // Ensure payments array exists
        bill.payments.push(newPayment);

        // Recalculate bill status
        const totalPaid = bill.payments.reduce((sum, p) => sum + parseFloat(p.amountPaid || 0), 0);
        
        // Ensure totalAmount is a number
        const totalAmount = parseFloat(bill.totalAmount);
        if (isNaN(totalAmount)) {
            console.error(`Bill ${bill.id} has an invalid totalAmount: ${bill.totalAmount}`);
            bill.status = 'error_invalid_amount'; // Or handle error appropriately
        } else if (totalPaid >= totalAmount) {
          bill.status = 'paid';
        } else if (totalPaid > 0 && totalPaid < totalAmount) {
          bill.status = 'partially_paid';
        } else if (totalPaid === 0 && new Date(bill.dueDate) < new Date() && bill.status !== 'pending') {
             // This logic for overdue might need refinement based on exact requirements for when a bill becomes overdue
             // For instance, if it's pending and due date passes.
             // For now, we assume it's 'pending' until a payment or it explicitly becomes 'overdue' by another process.
        } else if (totalPaid === 0) {
            bill.status = 'pending'; // Reset to pending if all payments were hypothetically removed and totalPaid is 0
        }
        // Note: 'overdue' status might need to be handled by a separate process that checks due dates daily/periodically.
        // For now, it's primarily 'pending', 'partially_paid', 'paid'.

        state.bills[billIndex] = bill; // Update the bill in the array
        saveBillsToLocalStorage(state.bills);
      }
    },
    // Generic updateBill if needed for other modifications
    updateBill: (state, action) => {
      const index = state.bills.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = { ...state.bills[index], ...action.payload };
        // If status or payments are directly manipulated here, ensure consistency.
        // It's often better to have specific actions like recordPaymentOnBill for complex updates.
        saveBillsToLocalStorage(state.bills);
      }
    },
    setBills: (state, action) => {
      state.bills = action.payload.map(bill => ({ ...bill, payments: bill.payments || [] }));
      saveBillsToLocalStorage(state.bills);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addBill,
  recordPaymentOnBill, // Export the new action
  updateBill,
  setBills,
  setLoading,
  setError,
  clearError,
} = billSlice.actions;

export default billSlice.reducer;
