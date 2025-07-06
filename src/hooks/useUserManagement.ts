
import { useUserData } from "./useUserData";
import { usePendingUsers } from "./usePendingUsers";
import { useUserActions } from "./useUserActions";

export const useUserManagement = () => {
  const { users, loading, refreshUsers } = useUserData();
  const pendingUsers = usePendingUsers(users);
  const { toggleApproval, rejectUser, updateUserType, deleteUser, approveAllPending, toggleVerification, toggleSuspension } = useUserActions(refreshUsers);

  const handleApproveAllPending = () => {
    const pendingIds = pendingUsers.map(user => user.id);
    return approveAllPending(pendingIds);
  };

  return {
    users,
    pendingUsers,
    loading,
    fetchUsers: refreshUsers,
    toggleApproval,
    toggleVerification,
    rejectUser,
    updateUserType,
    deleteUser,
    approveAllPending: handleApproveAllPending,
    toggleSuspension
  };
};
