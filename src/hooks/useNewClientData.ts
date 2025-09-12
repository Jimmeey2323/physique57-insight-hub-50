
import { useState, useEffect } from 'react';
import { NewClientData } from '@/types/dashboard';

const GOOGLE_CONFIG = {
  CLIENT_ID: "416630995185-007ermh3iidknbbtdmu5vct207mdlbaa.apps.googleusercontent.com",
  CLIENT_SECRET: "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",
  REFRESH_TOKEN: "1//04pAfj5ZB3ahLCgYIARAAGAQSNwF-L9IrqCo4OyUjAbO1hP5bR3vhs8K96zDZkbeCzcuCjzEiBPZ3O639cLRkUduicMYK1Rzs5GY",
  TOKEN_URL: "https://oauth2.googleapis.com/token"
};

const SPREADSHEET_ID = "149ILDqovzZA6FRUJKOwzutWdVqmqWBtWPfzG3A0zxTI";

export const useNewClientData = () => {
  const [data, setData] = useState<NewClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAccessToken = async () => {
    try {
      const response = await fetch(GOOGLE_CONFIG.TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CONFIG.CLIENT_ID,
          client_secret: GOOGLE_CONFIG.CLIENT_SECRET,
          refresh_token: GOOGLE_CONFIG.REFRESH_TOKEN,
          grant_type: 'refresh_token',
        }),
      });

      const tokenData = await response.json();
      return tokenData.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

  const fetchNewClientData = async () => {
    try {
      setLoading(true);
      const accessToken = await getAccessToken();
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/New?alt=json`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch new client data');
      }

      const result = await response.json();
      const rows = result.values || [];
      
      if (rows.length < 2) {
        setData([]);
        return;
      }

      const newClientData: NewClientData[] = rows.slice(1).map((row: any[]) => ({
        memberId: row[0] || '',
        firstName: row[1] || '',
        lastName: row[2] || '',
        email: row[3] || '',
        phoneNumber: row[4] || '',
        firstVisitDate: row[5] || '',
        firstVisitEntityName: row[6] || '',
        firstVisitType: row[7] || '',
        firstVisitLocation: row[8] || '',
        paymentMethod: row[9] || '',
        membershipUsed: row[10] || '',
        homeLocation: row[11] || '',
        classNo: parseFloat(row[12]) || 0,
        trainerName: row[13] || '',
        isNew: row[14] || '',
        visitsPostTrial: parseFloat(row[15]) || 0,
        membershipsBoughtPostTrial: row[16] || '',
        purchaseCountPostTrial: parseFloat(row[17]) || 0,
        ltv: parseFloat(row[18]) || 0,
        retentionStatus: row[19] || '',
        conversionStatus: row[20] || '',
        period: row[21] || '',
        unique: row[22] || '',
        firstPurchase: row[23] || '',
        conversionSpan: parseFloat(row[24]) || 0,
      }));

      console.log('New client data loaded:', newClientData.length, 'records');
      setData(newClientData);
      setError(null);
    } catch (err) {
      console.error('Error fetching new client data:', err);
      setError('Failed to load new client data');
      
      // Use mock data for development
      console.log('Using mock new client data for development');
      const mockData: NewClientData[] = [
        {
          memberId: 'M001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          phoneNumber: '+91-9876543210',
          firstVisitDate: '2024-01-15',
          firstVisitEntityName: 'Kwality House, Kemps Corner',
          firstVisitType: 'Trial Class',
          firstVisitLocation: 'Kwality House, Kemps Corner',
          paymentMethod: 'Credit Card',
          membershipUsed: 'Unlimited Monthly',
          homeLocation: 'Kwality House, Kemps Corner',
          classNo: 1,
          trainerName: 'Sarah Johnson',
          isNew: 'Yes',
          visitsPostTrial: 8,
          membershipsBoughtPostTrial: 'Unlimited Monthly',
          purchaseCountPostTrial: 1,
          ltv: 15000,
          retentionStatus: 'Retained',
          conversionStatus: 'Converted',
          period: 'January 2024',
          unique: 'unique_123',
          firstPurchase: 'Unlimited Monthly',
          conversionSpan: 5,
        },
        {
          memberId: 'M002',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@email.com',
          phoneNumber: '+91-9876543211',
          firstVisitDate: '2024-01-20',
          firstVisitEntityName: 'Supreme HQ, Bandra',
          firstVisitType: 'Drop-in Class',
          firstVisitLocation: 'Supreme HQ, Bandra',
          paymentMethod: 'UPI',
          membershipUsed: 'Class Pack 10',
          homeLocation: 'Supreme HQ, Bandra',
          classNo: 2,
          trainerName: 'Mike Wilson',
          isNew: 'Yes',
          visitsPostTrial: 12,
          membershipsBoughtPostTrial: 'Class Pack 10',
          purchaseCountPostTrial: 2,
          ltv: 8000,
          retentionStatus: 'Retained',
          conversionStatus: 'Converted',
          period: 'January 2024',
          unique: 'unique_124',
          firstPurchase: 'Class Pack 10',
          conversionSpan: 7,
        },
        {
          memberId: 'M003',
          firstName: 'Alex',
          lastName: 'Brown',
          email: 'alex.brown@email.com',
          phoneNumber: '+91-9876543212',
          firstVisitDate: '2024-02-01',
          firstVisitEntityName: 'Kenkere House, Bengaluru',
          firstVisitType: 'Trial Class',
          firstVisitLocation: 'Kenkere House, Bengaluru',
          paymentMethod: 'Debit Card',
          membershipUsed: 'Class Pack 5',
          homeLocation: 'Kenkere House, Bengaluru',
          classNo: 3,
          trainerName: 'Lisa Davis',
          isNew: 'Yes',
          visitsPostTrial: 5,
          membershipsBoughtPostTrial: 'Class Pack 5',
          purchaseCountPostTrial: 1,
          ltv: 4500,
          retentionStatus: 'Not Retained',
          conversionStatus: 'Converted',
          period: 'February 2024',
          unique: 'unique_125',
          firstPurchase: 'Class Pack 5',
          conversionSpan: 3,
        },
        {
          memberId: 'M004',
          firstName: 'Emma',
          lastName: 'Wilson',
          email: 'emma.wilson@email.com',
          phoneNumber: '+91-9876543213',
          firstVisitDate: '2024-02-10',
          firstVisitEntityName: 'Kwality House, Kemps Corner',
          firstVisitType: 'Trial Class',
          firstVisitLocation: 'Kwality House, Kemps Corner',
          paymentMethod: 'UPI',
          membershipUsed: 'Unlimited Monthly',
          homeLocation: 'Kwality House, Kemps Corner',
          classNo: 4,
          trainerName: 'Sarah Johnson',
          isNew: 'Yes',
          visitsPostTrial: 6,
          membershipsBoughtPostTrial: '',
          purchaseCountPostTrial: 0,
          ltv: 0,
          retentionStatus: 'Not Retained',
          conversionStatus: 'Not Converted',
          period: 'February 2024',
          unique: 'unique_126',
          firstPurchase: '',
          conversionSpan: 0,
        },
        {
          memberId: 'M005',
          firstName: 'David',
          lastName: 'Garcia',
          email: 'david.garcia@email.com',
          phoneNumber: '+91-9876543214',
          firstVisitDate: '2024-02-15',
          firstVisitEntityName: 'Supreme HQ, Bandra',
          firstVisitType: 'Drop-in Class',
          firstVisitLocation: 'Supreme HQ, Bandra',
          paymentMethod: 'Credit Card',
          membershipUsed: 'Unlimited Monthly',
          homeLocation: 'Supreme HQ, Bandra',
          classNo: 5,
          trainerName: 'Mike Wilson',
          isNew: 'Yes',
          visitsPostTrial: 10,
          membershipsBoughtPostTrial: 'Unlimited Monthly',
          purchaseCountPostTrial: 1,
          ltv: 12000,
          retentionStatus: 'Retained',
          conversionStatus: 'Converted',
          period: 'February 2024',
          unique: 'unique_127',
          firstPurchase: 'Unlimited Monthly',
          conversionSpan: 8,
        }
      ];
      setData(mockData);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewClientData();
  }, []);

  return { data, loading, error, refetch: fetchNewClientData };
};
