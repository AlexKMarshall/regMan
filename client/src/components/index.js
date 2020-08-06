// imports all components and exports them so that they can be called from any where simply
// by importing '@/components' and destructuring the desired component.
// All components are created with an index.js in the root directory to avoid
// duplication in the pathings.

import Auth0ProviderWithHistory from './Resources/Auth';
import Confirmation from './Form/Confirmation';
import Dashboard from './Dashboard';
import DeleteParticipantButton from './Resources/DeleteParticipantButton';
import EditButtons from './Resources/EditButtons';
import Error404 from './Errors/Error404';
import Error500 from './Errors/Error500';
import Form from './Form';
import GroupsDisplay from './Dashboard/GroupsDisplay';
import HealthDetails from './ParticipantDetails/HealthDetails';
import Loading from './Resources/Loading';
import Navbar from './Resources/Navbar';
import ParticipantDetails from './ParticipantDetails';
import ParticipantItem from './Dashboard/ListParticipants/ParticipantItem';
import ParticipantList from './Dashboard/ListParticipants/ParticipantList';
import PaymentsDetails from './ParticipantDetails/PaymentsDetails';
import PaymentItem from './ParticipantDetails/PaymentsDetails/PaymentItem';
import PersonalDetails from './ParticipantDetails/PersonalDetails';
import Popup from './Resources/Popup';
import PopupMessage from './Resources/Popup/PopupMessage';
import PrivateRoute from './Resources/PrivateRoute';
import SmartLink from './Resources/SmartLink';
import StatusLight from './Resources/StatusLight';

export {
  Auth0ProviderWithHistory,
  Confirmation,
  Dashboard,
  DeleteParticipantButton,
  EditButtons,
  Error404,
  Error500,
  Form,
  GroupsDisplay,
  HealthDetails,
  Loading,
  Navbar,
  ParticipantDetails,
  ParticipantItem,
  ParticipantList,
  PaymentsDetails,
  PaymentItem,
  PersonalDetails,
  Popup,
  PopupMessage,
  PrivateRoute,
  SmartLink,
  StatusLight,
};
