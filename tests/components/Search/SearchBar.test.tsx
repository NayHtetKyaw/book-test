import { render, screen, fireEvent } from "../../setup/test-utils";
import { SearchBar } from "@/components/Search/SearchBar";

describe("SearchBar", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render search input and button", () => {
    render(<SearchBar onSearchAction={mockOnSearch} />);

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("search-button")).toBeInTheDocument();
  });

  it("should render custom placeholder when provided", () => {
    const customPlaceholder = "Search for amazing books...";
    render(
      <SearchBar
        onSearchAction={mockOnSearch}
        placeholder={customPlaceholder}
      />,
    );

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it("should update input value when user types", () => {
    render(<SearchBar onSearchAction={mockOnSearch} />);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "gatsby" } });

    expect(searchInput).toHaveValue("gatsby");
  });

  it("should call onSearch when search button is clicked", () => {
    render(<SearchBar onSearchAction={mockOnSearch} />);

    const searchInput = screen.getByTestId("search-input");
    const searchButton = screen.getByTestId("search-button");

    fireEvent.change(searchInput, { target: { value: "gatsby" } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith("gatsby");
  });

  it("should call onSearch when Enter key is pressed", () => {
    render(<SearchBar onSearchAction={mockOnSearch} />);

    const searchInput = screen.getByTestId("search-input");

    fireEvent.change(searchInput, { target: { value: "tolkien" } });
    // Changed from keyPress to keyDown for better compatibility
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });

    expect(mockOnSearch).toHaveBeenCalledWith("tolkien");
  });

  it("should call onSearch with empty string", () => {
    render(<SearchBar onSearchAction={mockOnSearch} />);

    const searchButton = screen.getByTestId("search-button");
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith("");
  });

  it("should handle special characters in search", () => {
    render(<SearchBar onSearchAction={mockOnSearch} />);

    const searchInput = screen.getByTestId("search-input");
    const searchButton = screen.getByTestId("search-button");

    fireEvent.change(searchInput, { target: { value: "@#$%^&*()" } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith("@#$%^&*()");
  });
});
