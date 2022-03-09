import { Icon, Menu, Sidebar } from "semantic-ui-react";

const Layout = ({ children }) => {
  return (
    <Sidebar.Pushable>
      <Sidebar>
        <Menu.Item>
          <Icon name="home" />
        </Menu.Item>
      </Sidebar>
    </Sidebar.Pushable>
  );
};

export default Layout;
