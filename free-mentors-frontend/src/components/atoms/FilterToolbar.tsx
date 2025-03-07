import React from 'react';
import { 
  Box, 
  TextField, 
  FormControl, 
  Select, 
  MenuItem, 
  Button, 
  InputAdornment,
  SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Search,
  Refresh,
  FilterList,
  Download as DownloadIcon
} from '@mui/icons-material';
import { UserRole } from '../../contexts/AuthContext';

interface FilterToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  fetchUsers: () => void;
  handleDownload: () => void;
}

// Styled components
const FilterSection = styled(Box)({
  padding: '16px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap',
  borderBottom: '1px solid #e5e7eb',
  justifyContent: 'flex-start',
});

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d0d0d0',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1A5FFF',
    },
    boxShadow: 'none',
  },
  flexGrow: 1,
  maxWidth: '400px',
});

const StyledSelect = styled(FormControl)({
  minWidth: '160px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d0d0d0',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1A5FFF',
    },
    boxShadow: 'none',
  },
});

const ActionButton = styled(Button)({
  borderRadius: '6px',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: 'none',
  fontSize: '14px',
  padding: '8px 16px',
  height: '40px',
  '&.primary': {
    background: 'linear-gradient(135deg, #1A5FFF 0%, #1A3D94 100%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(135deg, #1A5FFF 20%, #1A3D94 100%)',
    },
  },
  '&.secondary': {
    color: '#555',
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
    '&:hover': {
      borderColor: '#d0d0d0',
      backgroundColor: 'white',
    },
  },
});

const DownloadButton = styled(Button)({
  borderRadius: '6px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '14px',
  padding: '8px 16px',
  height: '40px',
  border: '1px solid #1A5FFF',
  color: '#1A5FFF',
  backgroundColor: 'white',
  marginLeft: 'auto',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(26, 95, 255, 0.05)',
    background: 'linear-gradient(135deg, rgba(26, 95, 255, 0.05) 0%, rgba(26, 61, 148, 0.05) 100%)',
    borderColor: '#1A3D94',
  },
});

const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  fetchUsers,
  handleDownload
}) => {
  const handleRoleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value as string);
  };

  return (
    <FilterSection>
      <SearchField
        placeholder="Search by name or email"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <StyledSelect size="small">
        <Select
          id="role-filter"
          value={roleFilter}
          displayEmpty
          onChange={handleRoleFilterChange}
          sx={{ fontSize: '14px', height: '40px' }}
          startAdornment={<FilterList sx={{ fontSize: 16, mr: 1, color: '#6b7280' }} />}
          renderValue={(selected) => selected || "All Roles"}
        >
          <MenuItem value="" sx={{ fontSize: '14px' }}>All Roles</MenuItem>
          {Object.values(UserRole).map((role) => (
            <MenuItem key={role} value={role} sx={{ fontSize: '14px' }}>
              {role === 'USER' ? 'Mentee' : role.charAt(0) + role.slice(1).toLowerCase()}
            </MenuItem>
          ))}
        </Select>
      </StyledSelect>

      <ActionButton
        variant="outlined"
        className="secondary"
        startIcon={<Refresh fontSize="small" />}
        onClick={fetchUsers}
      >
        Refresh
      </ActionButton>
      
      <DownloadButton
        onClick={handleDownload}
        startIcon={<DownloadIcon fontSize="small" />}
      >
        Download Excel
      </DownloadButton>
    </FilterSection>
  );
};

export default FilterToolbar;