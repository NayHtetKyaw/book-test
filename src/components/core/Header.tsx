"use client";

import {
  Group,
  Text,
  Button,
  ActionIcon,
  Badge,
  Modal,
  TextInput,
  PasswordInput,
  Stack,
  Alert,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconShoppingCart,
  IconBook2,
  IconLogin,
  IconLogout,
} from "@tabler/icons-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { CartModal } from "../Cart/CartModal";

export function HeaderComponent() {
  const [loginOpened, { open: openLogin, close: closeLogin }] =
    useDisclosure(false);
  const [cartOpened, { open: openCart, close: closeCart }] =
    useDisclosure(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { user, login, logout, isLoading } = useAuthStore();
  const { getTotalItems } = useCartStore();

  const handleLogin = async () => {
    setError("");
    const success = await login(email, password);

    if (success) {
      notifications.show({
        title: "Success",
        message: "Logged in successfully!",
        color: "green",
      });
      closeLogin();
      setEmail("");
      setPassword("");
    } else {
      setError(
        "Invalid email or password. Try user@bookworks.com / password123",
      );
    }
  };

  const handleLogout = () => {
    logout();
    notifications.show({
      title: "Success",
      message: "Logged out successfully!",
      color: "blue",
    });
  };

  return (
    <>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <IconBook2 size={28} color="blue" />
          <Text size="xl" fw={700} c="blue">
            BookWorks
          </Text>
        </Group>

        <Group>
          {user ? (
            <Button
              leftSection={<IconLogout size={16} />}
              variant="light"
              onClick={handleLogout}
              data-testid="logout-button"
            >
              Logout
            </Button>
          ) : (
            <Button
              leftSection={<IconLogin size={16} />}
              variant="light"
              onClick={openLogin}
              data-testid="login-button"
            >
              Login
            </Button>
          )}

          <ActionIcon
            size="lg"
            variant="light"
            onClick={openCart}
            data-testid="cart-button"
            style={{ position: "relative" }}
          >
            <IconShoppingCart size={20} />
            {getTotalItems() > 0 && (
              <Badge
                size="sm"
                variant="filled"
                color="red"
                style={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  minWidth: 20,
                  height: 20,
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                data-testid="cart-count"
              >
                {getTotalItems()}
              </Badge>
            )}
          </ActionIcon>
        </Group>
      </Group>

      {/* Login Modal */}
      <Modal
        opened={loginOpened}
        onClose={closeLogin}
        title="Login to BookWorks"
        data-testid="login-modal"
      >
        <Stack>
          {error && (
            <Alert color="red" data-testid="login-error">
              {error}
            </Alert>
          )}

          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="email-input"
            required
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="password-input"
            required
          />

          <Button
            onClick={handleLogin}
            loading={isLoading}
            data-testid="login-submit"
            fullWidth
          >
            {isLoading ? <Loader size="sm" /> : "Login"}
          </Button>
        </Stack>
      </Modal>

      {/* Cart Modal */}
      <CartModal opened={cartOpened} onCloseAction={closeCart} />
    </>
  );
}
