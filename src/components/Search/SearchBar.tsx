"use client";

import { TextInput, Button, Group } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";

interface SearchBarProps {
  onSearchAction: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearchAction,
  placeholder = "Search for books, authors, or genres...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearchAction(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Group gap="sm" style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
      <TextInput
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        style={{ flex: 1 }}
        data-testid="search-input"
        leftSection={<IconSearch size={16} />}
      />
      <Button onClick={handleSearch} data-testid="search-button">
        Search
      </Button>
    </Group>
  );
}
