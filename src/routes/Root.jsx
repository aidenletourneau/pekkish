import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses } from 'react-pro-sidebar';
import { Outlet } from 'react-router-dom';
import {Link } from 'react-router-dom'


export default function Root() {




  return (
      
      <>
        <Sidebar rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: 'gray',
          },
          }}>
          <Menu>
            <MenuItem component={<Link to='/'/>}> Home </MenuItem>
            <MenuItem component={<Link to='/about'/>}> About </MenuItem>
          </Menu>
        </Sidebar>
        <Outlet/>
      </>
  )
}