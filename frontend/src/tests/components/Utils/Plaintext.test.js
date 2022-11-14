import { render, screen } from "@testing-library/react";
import Plaintext from "main/components/Utils/Plaintext"

describe("Plaintext tests", () => {
    test("renders the correct text", async () => {
        // Arrange
        const text = "foo\nbar\n  baz"

        const [firstLine, ...rest] = text.split('\n')

        // Act
        render(
            <Plaintext text={text}  />
        );

        // Assert
        expect(await screen.findByText(firstLine)).toBeInTheDocument();
        rest.forEach(line => {
            expect(screen.getByText(line.trim())).toBeInTheDocument();
        });
    });
});
