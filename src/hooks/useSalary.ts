import { useState, useCallback } from 'react';
import { salaryService, SalaryRecord, RecordSalaryPayload } from '../services/salary.service';
import toast from 'react-hot-toast';

export const useSalary = () => {
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSalaries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await salaryService.fetchSalaries();
      if (res.success && res.data) {
        setSalaries(res.data);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to fetch payroll records';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const recordNewSalary = async (data: RecordSalaryPayload) => {
    setLoading(true);
    try {
      const res = await salaryService.recordSalary(data);
      if (res.success) {
        toast.success('Salary recorded successfully');
        // Trigger a fresh fetch to ensure the nested User data is fully loaded
        await fetchSalaries(); 
        return true;
      }
      return false;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to record salary';
      toast.error(errMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    salaries,
    loading,
    error,
    fetchSalaries,
    recordNewSalary
  };
};