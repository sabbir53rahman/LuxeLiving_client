import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { 
  useValidateUserQuery, 
  useValidateAgentQuery, 
  useValidateSellerQuery, 
  useValidateBuyerQuery 
} from '@/redux/api/authApi';

export const useValidateUser = () => {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  // Use the appropriate hook based on user role
  const userQuery = useValidateUserQuery(undefined, { skip: !!userRole });
  const agentQuery = useValidateAgentQuery(undefined, { skip: userRole !== 'agent' });
  const sellerQuery = useValidateSellerQuery(undefined, { skip: userRole !== 'seller' });
  const buyerQuery = useValidateBuyerQuery(undefined, { skip: userRole !== 'buyer' });

  // Return the appropriate query based on role
  switch (userRole) {
    case 'agent':
      return agentQuery;
    case 'seller':
      return sellerQuery;
    case 'buyer':
      return buyerQuery;
    default:
      return userQuery;
  }
};
