import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UsersTable from "main/components/Users/UsersTable";
import { formatTime } from "main/utils/dateUtils";
import usersFixtures from "fixtures/usersFixtures";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("UserTable tests", () => {

    const mockAxios = new MockAdapter(axios);

    afterEach(() => {
        mockAxios.reset();
    });

    test("renders without crashing for empty table", () => {
        render(
            <UsersTable users={[]} />
        );
    });

    test("renders without crashing for three users", () => {
        render(
            <UsersTable users={usersFixtures.threeUsers} />
        );
    });

    test("Has the expected colum headers and content", () => {
        render(
          <UsersTable users={usersFixtures.threeUsers}/>
        );
    
        const expectedHeaders = ["id", "First Name", "Last Name", "Email", "Last Online", "Admin"];
        const expectedFields = ["id", "givenName", "familyName", "email", "lastOnline", "admin"];
        const testId = "UsersTable";

        expectedHeaders.forEach( (headerText)=> {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach( (field)=> {
          const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-admin`)).toHaveTextContent("true");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-lastOnline`)).toHaveTextContent(formatTime(usersFixtures.threeUsers[0].lastOnline));
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-admin`)).toHaveTextContent("false");
      });

    test("commons state is initialized as empty array", () => {
        render(<UsersTable users={usersFixtures.threeUsers} />);
        const commonsState = screen.queryByTestId("commons-state");
        expect(commonsState).toHaveTextContent("[]");
    });

    test("shows modal when Edit Commons button is clicked and fetches commons", async () => {
        const user = usersFixtures.threeUsers[0];
        const commons = [{ id: 1, name: "Commons 1" }, { id: 2, name: "Commons 2" }];
        
        mockAxios.onGet(`/api/admin/users/${user.id}/commons`).reply(200, commons);

        render(<UsersTable users={usersFixtures.threeUsers} />);
        const editButton = screen.getByTestId(`edit-commons-${user.id}`);
        fireEvent.click(editButton);

        await waitFor(() => expect(screen.getByText("Remove User from Commons")).toBeInTheDocument());
        expect(screen.getByLabelText("Commons 1")).toBeInTheDocument();
        expect(screen.getByLabelText("Commons 2")).toBeInTheDocument();
    });

    test("handles remove user from commons", async () => {
        const user = usersFixtures.threeUsers[0];
        const commons = [{ id: 1, name: "Commons 1" }, { id: 2, name: "Commons 2" }];
        
        mockAxios.onGet(`/api/admin/users/${user.id}/commons`).reply(200, commons);
        mockAxios.onDelete(`/api/commons/1/users/${user.id}`).reply(200, { message: "User removed from commons" });
        mockAxios.onDelete(`/api/commons/2/users/${user.id}`).reply(200, { message: "User removed from commons" });

        console.log = jest.fn(); // Mock console.log

        render(<UsersTable users={usersFixtures.threeUsers} />);
        const editButton = screen.getByTestId(`edit-commons-${user.id}`);
        fireEvent.click(editButton);

        await waitFor(() => expect(screen.getByText("Remove User from Commons")).toBeInTheDocument());

        const checkbox1 = screen.getByLabelText("Commons 1");
        const checkbox2 = screen.getByLabelText("Commons 2");
        fireEvent.click(checkbox1);
        fireEvent.click(checkbox2);

        const removeButton = screen.getByText("Remove from Selected Commons");
        fireEvent.click(removeButton);

        await waitFor(() => expect(mockAxios.history.delete.length).toBe(2));
        expect(mockAxios.history.delete[0].url).toBe(`/api/commons/1/users/${user.id}`);
        expect(mockAxios.history.delete[1].url).toBe(`/api/commons/2/users/${user.id}`);

        expect(console.log).toHaveBeenCalledWith("User removed from commons", { message: "User removed from commons" });
    });

    test("handles error when fetching commons", async () => {
        const user = usersFixtures.threeUsers[0];
        
        mockAxios.onGet(`/api/admin/users/${user.id}/commons`).reply(500);

        console.error = jest.fn(); // Mock console.error

        render(<UsersTable users={usersFixtures.threeUsers} />);
        const editButton = screen.getByTestId(`edit-commons-${user.id}`);
        fireEvent.click(editButton);

        await waitFor(() => expect(screen.queryByText("Remove User from Commons")).not.toBeInTheDocument());
        expect(console.error).toHaveBeenCalledWith("There was an error fetching the commons!", expect.anything());
    });

    test("handles checkbox change", async () => {
        const user = usersFixtures.threeUsers[0];
        const commons = [{ id: 1, name: "Commons 1" }, { id: 2, name: "Commons 2" }];
        
        mockAxios.onGet(`/api/admin/users/${user.id}/commons`).reply(200, commons);

        render(<UsersTable users={usersFixtures.threeUsers} />);
        const editButton = screen.getByTestId(`edit-commons-${user.id}`);
        fireEvent.click(editButton);

        await waitFor(() => expect(screen.getByText("Remove User from Commons")).toBeInTheDocument());

        const checkbox1 = screen.getByLabelText("Commons 1");
        const checkbox2 = screen.getByLabelText("Commons 2");

        // Test initial state (unchecked)
        expect(checkbox1).not.toBeChecked();
        expect(checkbox2).not.toBeChecked();

        // Check the first checkbox and verify state
        fireEvent.click(checkbox1);
        expect(checkbox1).toBeChecked();
        expect(screen.queryByTestId("selected-commons-state")).toHaveTextContent("[1]");

        // Uncheck the first checkbox and verify state
        fireEvent.click(checkbox1);
        expect(checkbox1).not.toBeChecked();
        expect(screen.queryByTestId("selected-commons-state")).toHaveTextContent("[]");

        // Check the second checkbox and verify state
        fireEvent.click(checkbox2);
        expect(checkbox2).toBeChecked();
        expect(screen.queryByTestId("selected-commons-state")).toHaveTextContent("[2]");

        // Check the first checkbox again and verify state
        fireEvent.click(checkbox1);
        expect(checkbox1).toBeChecked();
        expect(screen.queryByTestId("selected-commons-state")).toHaveTextContent("[2,1]");

        // Uncheck the second checkbox and verify state
        fireEvent.click(checkbox2);
        expect(checkbox2).not.toBeChecked();
        expect(screen.queryByTestId("selected-commons-state")).toHaveTextContent("[1]");
    });

    test("handles error when removing user from commons", async () => {
        const user = usersFixtures.threeUsers[0];
        const commons = [{ id: 1, name: "Commons 1" }];
        
        mockAxios.onGet(`/api/admin/users/${user.id}/commons`).reply(200, commons);
        mockAxios.onDelete(`/api/commons/1/users/${user.id}`).reply(500);

        console.error = jest.fn(); // Mock console.error

        render(<UsersTable users={usersFixtures.threeUsers} />);
        const editButton = screen.getByTestId(`edit-commons-${user.id}`);
        fireEvent.click(editButton);

        await waitFor(() => expect(screen.getByText("Remove User from Commons")).toBeInTheDocument());

        const checkbox1 = screen.getByLabelText("Commons 1");
        fireEvent.click(checkbox1);

        const removeButton = screen.getByText("Remove from Selected Commons");
        fireEvent.click(removeButton);

        await waitFor(() => expect(mockAxios.history.delete.length).toBe(1));
        expect(mockAxios.history.delete[0].url).toBe(`/api/commons/1/users/${user.id}`);

        expect(console.error).toHaveBeenCalledWith("There was an error removing the user from the commons!", expect.anything());
    });

    test("handleShow works correctly and updates commons state", async () => {
        const user = usersFixtures.threeUsers[0];
        const commons = [{ id: 1, name: "Commons 1" }, { id: 2, name: "Commons 2" }];

        mockAxios.onGet(`/api/admin/users/${user.id}/commons`).reply(200, commons);

        render(<UsersTable users={usersFixtures.threeUsers} />);
        const editButton = screen.getByTestId(`edit-commons-${user.id}`);
        fireEvent.click(editButton);

        await waitFor(() => expect(screen.getByText("Remove User from Commons")).toBeInTheDocument());
        expect(screen.getByLabelText("Commons 1")).toBeInTheDocument();
        expect(screen.getByLabelText("Commons 2")).toBeInTheDocument();
    });

    test("handleClose works correctly", async () => {
        const user = usersFixtures.threeUsers[0];
        const commons = [{ id: 1, name: "Commons 1" }, { id: 2, name: "Commons 2" }];
        
        mockAxios.onGet(`/api/admin/users/${user.id}/commons`).reply(200, commons);

        render(<UsersTable users={usersFixtures.threeUsers} />);
        const editButton = screen.getByTestId(`edit-commons-${user.id}`);
        fireEvent.click(editButton);

        await waitFor(() => expect(screen.getByText("Remove User from Commons")).toBeInTheDocument());

        const closeButton = screen.getByText("Close");
        fireEvent.click(closeButton);

        await waitFor(() => expect(screen.queryByText("Remove User from Commons")).not.toBeInTheDocument());
    });

    test("handleRemove updates state correctly and makes delete requests", async () => {
        const user = usersFixtures.threeUsers[0];
        const commons = [{ id: 1, name: "Commons 1" }, { id: 2, name: "Commons 2" }];

        mockAxios.onGet(`/api/admin/users/${user.id}/commons`).reply(200, commons);
        mockAxios.onDelete(`/api/commons/1/users/${user.id}`).reply(200, { message: "User removed from commons" });
        mockAxios.onDelete(`/api/commons/2/users/${user.id}`).reply(200, { message: "User removed from commons" });

        render(<UsersTable users={usersFixtures.threeUsers} />);
        const editButton = screen.getByTestId(`edit-commons-${user.id}`);
        fireEvent.click(editButton);

        await waitFor(() => expect(screen.getByText("Remove User from Commons")).toBeInTheDocument());

        const checkbox1 = screen.getByLabelText("Commons 1");
        const checkbox2 = screen.getByLabelText("Commons 2");
        fireEvent.click(checkbox1);
        fireEvent.click(checkbox2);

        const removeButton = screen.getByText("Remove from Selected Commons");
        fireEvent.click(removeButton);

        await waitFor(() => expect(mockAxios.history.delete.length).toBe(2));
        expect(mockAxios.history.delete[0].url).toBe(`/api/commons/1/users/${user.id}`);
        expect(mockAxios.history.delete[1].url).toBe(`/api/commons/2/users/${user.id}`);

        expect(console.log).toHaveBeenCalledWith("User removed from commons", { message: "User removed from commons" });
    });

    test("handleCheckboxChange works correctly", async () => {
        const user = usersFixtures.threeUsers[0];
        const commons = [{ id: 1, name: "Commons 1" }, { id: 2, name: "Commons 2" }];

        mockAxios.onGet(`/api/admin/users/${user.id}/commons`).reply(200, commons);

        render(<UsersTable users={usersFixtures.threeUsers} />);
        const editButton = screen.getByTestId(`edit-commons-${user.id}`);
        fireEvent.click(editButton);

        await waitFor(() => expect(screen.getByText("Remove User from Commons")).toBeInTheDocument());

        const checkbox1 = screen.getByLabelText("Commons 1");
        const checkbox2 = screen.getByLabelText("Commons 2");

        // Test initial state (unchecked)
        expect(checkbox1).not.toBeChecked();
        expect(checkbox2).not.toBeChecked();

        // Check the first checkbox and verify state
        fireEvent.click(checkbox1);
        expect(checkbox1).toBeChecked();
        expect(screen.queryByTestId("selected-commons-state")).toHaveTextContent("[1]");

        // Uncheck the first checkbox and verify state
        fireEvent.click(checkbox1);
        expect(checkbox1).not.toBeChecked();
        expect(screen.queryByTestId("selected-commons-state")).toHaveTextContent("[]");

        // Check the second checkbox and verify state
        fireEvent.click(checkbox2);
        expect(checkbox2).toBeChecked();
        expect(screen.queryByTestId("selected-commons-state")).toHaveTextContent("[2]");

        // Check the first checkbox again and verify state
        fireEvent.click(checkbox1);
        expect(checkbox1).toBeChecked();
        expect(screen.queryByTestId("selected-commons-state")).toHaveTextContent("[2,1]");

        // Uncheck the second checkbox and verify state
        fireEvent.click(checkbox2);
        expect(checkbox2).not.toBeChecked();
        expect(screen.queryByTestId("selected-commons-state")).toHaveTextContent("[1]");
    });

    
    test("all Edit Commons buttons and fields are non-empty", async () => {
        render(
            <UsersTable users={usersFixtures.threeUsers} />
        );

        const testId = "UsersTable";

        // Check each row's "Edit Commons" button ID and other fields
        usersFixtures.threeUsers.forEach((user, index) => {
            const editButton = screen.getByTestId(`edit-commons-${user.id}`);
            expect(editButton).toBeInTheDocument();
            expect(editButton.getAttribute('data-testid')).not.toBe("");

            const fields = ["id", "givenName", "familyName", "email", "lastOnline", "admin", "editCommons"];
            fields.forEach((field) => {
                const cell = screen.getByTestId(`${testId}-cell-row-${index}-col-${field}`);
                expect(cell).toBeInTheDocument();
                expect(cell.textContent).not.toBe("");
            });

            const headers = ["id", "First Name", "Last Name", "Email", "Last Online", "Admin", "Edit Commons"];
            headers.forEach( (headerText)=> {
                const header = screen.getByText(headerText);
                expect(header).toBeInTheDocument();
            });
        });
    });
    

});