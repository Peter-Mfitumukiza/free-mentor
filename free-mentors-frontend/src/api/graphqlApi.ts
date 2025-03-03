const BASE_END_POINT = "http://localhost:8000/graphql/"



export const registerUser = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    bio?: string;
    address?: string;
    occupation?: string;
    expertise?: string;
  }) => {
    const { firstName, lastName, email, password, bio, address, occupation, expertise } = userData;

    
    const mutation = `
      mutation {
        registerUser(
          firstName: "${firstName}",
          lastName: "${lastName}",
          email: "${email}",
          password: "${password}"
          ${bio ? `, bio: "${bio}"` : ''}
          ${address ? `, address: "${address}"` : ''}
          ${occupation ? `, occupation: "${occupation}"` : ''}
          ${expertise ? `, expertise: "${expertise}"` : ''}
        ) {
          success
          message
        }
      }
    `;
    
    try {
      console.log('Mutation:', mutation);
      
      const response = await fetch('http://localhost:8000/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query: mutation }),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Unparseable response:', responseText);
        throw new Error(`Failed to parse server response: ${responseText}`);
      }
      
      console.log('Parsed result:', result);
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(result.errors.map((err: any) => err.message).join(', '));
      }
      
      if (!result.data || !result.data.registerUser) {
        throw new Error('Unexpected server response structure');
      }
      
      return result.data.registerUser;
    } catch (error) {
      console.error('Full registration error:', error);
      throw error;
    }
  };
  
  export const loginUser = async (email: string, password: string) => {
    const mutation = `
      mutation {
        loginUser(
          email: "${email}",
          password: "${password}"
        ) {
          success
          message
          token
        }
      }
    `;
    
    try {
      console.log('Logging in user:', email);
      const response = await fetch('http://localhost:8000/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: mutation }),
      });
      
      const result = await response.json();
      console.log('Login response:', result);
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(result.errors[0].message);
      }
      
      return result.data.loginUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  export const getAllUsers = async (token: string, role?: string) => {

    const query = `
      query {
        allUsers${role ? `(role: "${role}")` : ''} {
          firstName
          lastName
          email
          role
          bio
          address
          occupation
          expertise
        }
      }
    `;
    
    try {
      console.log('Fetching users with role:', role || 'all');
      const response = await fetch(BASE_END_POINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query }),
      });
      
      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(result.errors[0].message);
      }
      
      return result.data.allUsers;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  };
  
  export const changeUserRole = async (userEmail: string, newRole: string, token: string) => {
    const mutation = `
      mutation {
        changeUserRole(
          user_email: "${userEmail}",
          new_role: "${newRole}"
        ) {
          success
          message
        }
      }
    `;
    
    try {
      console.log('Changing role for user:', userEmail, 'to', newRole);
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: mutation }),
      });
      
      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(result.errors[0].message);
      }
      
      return result.data.changeUserRole;
    } catch (error) {
      console.error('Change role error:', error);
      throw error;
    }
  };


  export const requestSession = async (mentorEmail: string, token: string) => {
    const mutation = `
      mutation {
        requestMentorshipSession(
          mentorEmail: "${mentorEmail}"
        ) {
          success
          message
        }
      }
    `;
    
    try {
      const response = await fetch(BASE_END_POINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: mutation }),
      });
      
      const result = await response.json();
      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(result.errors[0].message);
      }
      
      return result.data.changeUserRole;
    } catch (error) {
      console.error('Change role error:', error);
      throw error;
    }
  };