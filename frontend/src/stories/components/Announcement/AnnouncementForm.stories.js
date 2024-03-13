import React from 'react';
import AnnouncementForm from "main/components/Announcement/AnnouncementForm"
import { announcementFixtures } from 'fixtures/announcementFixtures'

export default {
    title: 'components/Announcement/AnnouncementForm',
    component: AnnouncementForm,
};


const Template = (args) => {
    return (
        <AnnouncementForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: announcementFixtures.oneAnnouncement,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};
