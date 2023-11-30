import ChatMessageDisplay from "main/components/Chat/ChatMessageDisplay";
import {QueryClient, QueryClientProvider} from "react-query";
import {MemoryRouter} from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { chatMessageFixtures } from "fixtures/chatMessageFixtures";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { render, screen, waitFor } from "@testing-library/react";

describe("ChatMessageDisplay tests", () => {

    const queryClient = new QueryClient();
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(()=>{
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    });

    test("renders correct content with username", async () => {

        const message_no_name = chatMessageFixtures.oneChatMessage[0];

        const message = {...message_no_name, username: "John Doe"};

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ChatMessageDisplay message={message} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => {
            expect(screen.getByText("Hello World")).toBeInTheDocument();
        });

        expect(message.userId).toBe(1)
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("2023-08-17 23:57:46")).toBeInTheDocument();


        // Assert for lines 11-16
        const cardBody = screen.getByTestId("ChatMessageDisplay-1");

        const expectedBgColor = 'card bg-secondary text-white';
        expect(cardBody).toHaveClass(expectedBgColor)

        expect(screen.getByTestId("ChatMessageDisplay-1-User")).toHaveStyle("margin: 0px");
        expect(screen.getByTestId("ChatMessageDisplay-1-Date")).toHaveStyle("margin: 0px");

        /* eslint-disable-next-line testing-library/no-node-access */
        const styleDiv = screen.getByTestId("ChatMessageDisplay-1-User").parentElement;

        expect(styleDiv).toHaveStyle("display: flex; justify-content: space-between; align-items: center");
        expect(screen.getByTestId("ChatMessageDisplay-1-User")).toHaveStyle("margin: 0px");
        expect(screen.getByTestId("ChatMessageDisplay-1-Date")).toHaveStyle("margin: 0px");
    });

    test("renders correct content with empty username", async () => {

        const message_no_name = chatMessageFixtures.oneChatMessage[0];

        const message = {...message_no_name, username: ""};

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ChatMessageDisplay message={message} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => {
            expect(screen.getByText("Hello World")).toBeInTheDocument();
        });
        expect(message.userId).toBe(1)

        const cardBody = screen.getByTestId("ChatMessageDisplay-1");

        const expectedBgColor = 'card bg-secondary text-white';
        expect(cardBody).toHaveClass(expectedBgColor)

        expect(screen.getByText("Anonymous")).toBeInTheDocument();
        expect(screen.getByText("2023-08-17 23:57:46")).toBeInTheDocument();
    });

    test("renders correct content with no timestamp or username", async () => {

        const message_no_name = chatMessageFixtures.oneChatMessage[0];
        message_no_name.timestamp = null;

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ChatMessageDisplay message={message_no_name} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => {
            expect(screen.getByTestId("ChatMessageDisplay-1-Message")).toHaveTextContent("Hello World");
        });

        

        const cardBody = screen.getByTestId("ChatMessageDisplay-1");

        const expectedBgColor = 'card bg-secondary text-white';
        expect(cardBody).toHaveClass(expectedBgColor)

        expect(screen.getByTestId("ChatMessageDisplay-1-User")).toHaveTextContent("Anonymous");
        expect(screen.getByTestId("ChatMessageDisplay-1-Date")).toHaveTextContent("");
    });

    test("renders correct content with no message", async () => {

        // act
    
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ChatMessageDisplay />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => {
            expect(screen.getByTestId("ChatMessageDisplay-undefined-Message")).toHaveTextContent("");
        });



        const cardBody = screen.getByTestId("ChatMessageDisplay-undefined");

        const expectedBgColor = 'card bg-secondary text-white';
        expect(cardBody).toHaveClass(expectedBgColor)

        expect(screen.getByTestId("ChatMessageDisplay-undefined-User")).toHaveTextContent("Anonymous");
        expect(screen.getByTestId("ChatMessageDisplay-undefined-Date")).toHaveTextContent("");
    });

    test("current user message", async () => {

        const message = chatMessageFixtures.oneChatMessage[0];
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);

        message.userId = 2

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ChatMessageDisplay message={message}/>
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(message.userId).toBe(2)

        const cardBody = screen.getByTestId("ChatMessageDisplay-1");

        const expectedBgColor = 'card bg-primary text-white';
        expect(cardBody).toHaveClass(expectedBgColor)

        expect(screen.getByTestId("ChatMessageDisplay-1-User")).toHaveStyle("margin: 0px");
        expect(screen.getByTestId("ChatMessageDisplay-1-Date")).toHaveStyle("margin: 0px");

        /* eslint-disable-next-line testing-library/no-node-access */
        const styleDiv = screen.getByTestId("ChatMessageDisplay-1-User").parentElement;

        expect(styleDiv).toHaveStyle("display: flex; justify-content: space-between; align-items: center");
        expect(screen.getByTestId("ChatMessageDisplay-1-User")).toHaveStyle("margin: 0px");
        expect(screen.getByTestId("ChatMessageDisplay-1-Date")).toHaveStyle("margin: 0px");
    });
});