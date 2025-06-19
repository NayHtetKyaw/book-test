"use client";

import {
  Modal,
  Stack,
  Text,
  Button,
  Group,
  ActionIcon,
  Divider,
  NumberFormatter,
  Center,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconTrash, IconMinus, IconPlus } from "@tabler/icons-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

interface CartModalProps {
  opened: boolean;
  onCloseAction: () => void;
}

export function CartModal({ opened, onCloseAction }: CartModalProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      notifications.show({
        title: "Login Required",
        message: "Please login to proceed with checkout",
        color: "orange",
      });
      return;
    }

    if (items.length === 0) {
      notifications.show({
        title: "Empty Cart",
        message: "Your cart is empty",
        color: "orange",
      });
      return;
    }

    const total = getTotalPrice();
    notifications.show({
      title: "Checkout Successful!",
      message: `Order total: $${total.toFixed(2)}`,
      color: "green",
    });
    clearCart();
    onCloseAction();
  };

  return (
    <Modal
      opened={opened}
      onClose={onCloseAction}
      title="Shopping Cart"
      size="md"
      data-testid="cart-modal"
    >
      <Stack>
        {items.length === 0 ? (
          <Center h={100}>
            <Text c="dimmed" data-testid="empty-cart-message">
              Your cart is empty
            </Text>
          </Center>
        ) : (
          <>
            {items.map((item) => (
              <Group key={item.id} justify="space-between" align="flex-start">
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Text fw={500}>{item.title}</Text>
                  <Text size="sm" c="dimmed">
                    by {item.author}
                  </Text>
                  <Text size="sm" fw={500}>
                    <NumberFormatter
                      value={item.price}
                      prefix="$"
                      decimalScale={2}
                    />
                  </Text>
                </Stack>

                <Group gap="xs" align="center">
                  <ActionIcon
                    size="sm"
                    variant="light"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <IconMinus size={12} />
                  </ActionIcon>

                  <Text fw={500} style={{ minWidth: 20, textAlign: "center" }}>
                    {item.quantity}
                  </Text>

                  <ActionIcon
                    size="sm"
                    variant="light"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <IconPlus size={12} />
                  </ActionIcon>

                  <ActionIcon
                    size="sm"
                    color="red"
                    variant="light"
                    onClick={() => removeItem(item.id)}
                    data-testid={`remove-item-${item.id}`}
                  >
                    <IconTrash size={12} />
                  </ActionIcon>
                </Group>
              </Group>
            ))}

            <Divider />

            <Group justify="space-between">
              <Text size="lg" fw={700}>
                Total ({getTotalItems()} items):
              </Text>
              <Text size="lg" fw={700} c="blue" data-testid="cart-total">
                <NumberFormatter
                  value={getTotalPrice()}
                  prefix="$"
                  decimalScale={2}
                />
              </Text>
            </Group>

            <Button
              onClick={handleCheckout}
              size="lg"
              fullWidth
              data-testid="checkout-button"
            >
              Proceed to Checkout
            </Button>
          </>
        )}
      </Stack>
    </Modal>
  );
}
