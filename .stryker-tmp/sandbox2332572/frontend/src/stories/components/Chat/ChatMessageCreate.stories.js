import React from 'react';
import { rest } from 'msw';
import ChatMessageCreate from "main/components/Chat/ChatMessageCreate";

export default {
    title: 'components/Chat/ChatMessageCreate',
    component: ChatMessageCreate
};

const Template = (args) => {
    return (
        <ChatMessageCreate {...args} />
    )
};

export const Message = Template.bind({});

Message.args = {
    commonsId: 1,
};

Message.parameters = {
    msw: [
        rest.post('/api/chat/post', (req, res, ctx) => {
            window.alert("POST: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};