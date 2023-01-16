import { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Navbar from 'components/Navbar';
import { Outlet } from 'react-router-dom';
import Sidebar from 'components/Sidebar';
import { useGetUserQuery } from 'state/api';
import { useSelector } from 'react-redux';

const Layout = () => {
  const isNonMobile = useMediaQuery('(min-width: 600px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = useSelector((state) => state.global.userId);

  const { data: user, isFetching, isLoading } = useGetUserQuery(userId);

  return (
    <Box display={isNonMobile ? 'flex' : 'block'} height="100%" width="100%">
      <Sidebar
        user={user || {}}
        drawerWidth="250px"
        isNonMobile={isNonMobile}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}>
        <Navbar
          user={user || {}}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
