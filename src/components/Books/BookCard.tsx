"use client";

import {
  Card,
  Text,
  Button,
  Group,
  Stack,
  Badge,
  Rating,
  NumberFormatter,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconShoppingCart, IconBook } from "@tabler/icons-react";
import { useCartStore } from "@/store/cartStore";
import type { Book } from "@/types";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(book);
    notifications.show({
      title: "Added to Cart",
      message: `${book.title} has been added to your cart`,
      color: "green",
    });
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      data-testid={`book-card-${book.id}`}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={500} lineClamp={1}>
            {book.title}
          </Text>
          {book.category && (
            <Badge size="sm" variant="light">
              {book.category}
            </Badge>
          )}
        </Group>
      </Card.Section>

      <Stack gap="xs" mt="md">
        {/* Book Icon Placeholder */}
        <div
          style={{
            height: 150,
            backgroundColor: "#f8f9fa",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconBook size={48} color="#adb5bd" />
        </div>

        <Text size="sm" c="dimmed">
          by {book.author}
        </Text>

        {book.description && (
          <Text size="sm" lineClamp={2}>
            {book.description}
          </Text>
        )}

        {book.rating && (
          <Group gap="xs">
            <Rating value={book.rating} readOnly size="sm" />
            <Text size="sm" c="dimmed">
              ({book.rating})
            </Text>
          </Group>
        )}

        <Group justify="space-between" mt="md">
          <Text size="lg" fw={700} c="blue">
            <NumberFormatter value={book.price} prefix="$" decimalScale={2} />
          </Text>

          {book.stock !== undefined && (
            <Text size="xs" c={book.stock > 0 ? "green" : "red"}>
              {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
            </Text>
          )}
        </Group>

        <Button
          leftSection={<IconShoppingCart size={16} />}
          onClick={handleAddToCart}
          disabled={book.stock === 0}
          data-testid={`add-to-cart-${book.id}`}
          fullWidth
        >
          Add to Cart
        </Button>
      </Stack>
    </Card>
  );
}
