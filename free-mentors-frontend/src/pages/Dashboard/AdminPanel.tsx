import React, { useEffect, useState, useMemo } from "react";
import { useAuth, UserRole } from "../../contexts/AuthContext";
import { getAllUsers, changeUserRole } from "../../api/graphqlApi";
import { 
  Box, 
  Typography, 
  Paper, 
  Alert
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SidebarLayout from "../../components/atoms/sidebar/Sidebar";
import { toast } from "react-hot-toast";
import UserStats from "../../components/molecules/cards/UserStats";
import UserTable from "../../components/molecules/table/UserTable";
import FilterToolbar from "../../components/atoms/FilterToolbar";
import UnauthorizedPage from "../UnauthorizedPage";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  bio?: string;
  expertise?: string;
  occupation?: string;
}

const PageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  paddingLeft: '20px',
  paddingRight: '20px',
});

const HeaderSection = styled(Paper)({
  borderRadius: '8px',
  boxShadow: 'none',
  overflow: 'hidden',
  border: '1px solid #e5e7eb',
  backgroundColor: '#f5f7fa',
});

const HeaderContent = styled(Box)({
  padding: '20px 24px',
});

const TableSection = styled(Paper)({
  borderRadius: '8px',
  boxShadow: 'none',
  overflow: 'hidden',
  border: '1px solid #e5e7eb',
  backgroundColor: 'white',
});

const AdminPanel: React.FC = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (token && user?.role === UserRole.ADMIN) {
      fetchUsers();
    }
  }, [token, user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await getAllUsers(token!);
      setUsers(usersData);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to load users. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (email: string, newRole: string) => {
    try {
      setActionInProgress(email);
      setIsRoleMenuOpen({ ...isRoleMenuOpen, [email]: false });
      const result = await changeUserRole(email, newRole, token!);

      if (result.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === email ? { ...user, role: newRole } : user
          )
        );
        toast.success(`Role updated successfully`);
      } else {
        const errorMessage = result.message || "Failed to change user role";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Error changing role:", err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setActionInProgress(null);
    }
  };

  if (user?.role !== UserRole.ADMIN) {
    return <UnauthorizedPage />;
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const userCounts = useMemo(() => {
    const counts = {
      total: users.length,
      admin: users.filter(user => user.role === 'ADMIN').length,
      mentor: users.filter(user => user.role === 'MENTOR').length,
      mentee: users.filter(user => user.role === 'USER').length,
    };
    return counts;
  }, [users]);

  const handleDownload = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Role', 'Occupation'];
    const csvRows = [headers];
    
    users.forEach(user => {
      const row = [
        user.firstName,
        user.lastName,
        user.email,
        user.role === 'USER' ? 'Mentee' : user.role.charAt(0) + user.role.slice(1).toLowerCase(),
        user.occupation || ''
      ];
      csvRows.push(row);
    });
    
    const csvString = csvRows.map(row => row.map(cell => 
      `"${cell}"`
    ).join(',')).join('\n');
    
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'users_data.xlsx');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Excel file downloaded successfully");
  };

  return (
    <SidebarLayout>
      <PageContainer sx={{ paddingTop: '10px' }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ borderRadius: '6px', boxShadow: 'none', border: '1px solid #FECACA' }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <HeaderSection>
          <HeaderContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight={600} fontSize={18}>
                  User Management
                </Typography>
                <Typography variant="body2" color="text.secondary" fontSize={14} sx={{ mt: 0.5 }}>
                  Manage platform users and their roles
                </Typography>
              </Box>
            </Box>

            <UserStats userCounts={userCounts} />
          </HeaderContent>
        </HeaderSection>

        <TableSection>
          <FilterToolbar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            fetchUsers={fetchUsers}
            handleDownload={handleDownload}
          />

          <UserTable 
            users={filteredUsers}
            handleRoleChange={handleRoleChange}
            actionInProgress={actionInProgress}
            isRoleMenuOpen={isRoleMenuOpen}
            handleRoleButtonClick={(email: string) => 
              setIsRoleMenuOpen({ 
                ...isRoleMenuOpen, 
                [email]: !isRoleMenuOpen[email] 
              })
            }
          />
        </TableSection>
      </PageContainer>
    </SidebarLayout>
  );
};

export default AdminPanel;