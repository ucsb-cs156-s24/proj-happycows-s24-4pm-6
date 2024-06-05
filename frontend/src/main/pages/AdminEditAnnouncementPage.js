import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import AnnouncementForm from "main/components/Announcement/AnnouncementForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function AnnouncementEditPage() {
  let { id } = useParams();

  const { data: announcement, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/announcements/getbyid?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/announcements/getbyid`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (announcement) => ({
    url: "/api/announcements/put",
    method: "PUT",
    params: {
      id: announcement.id,
      commonsId: announcement.commonsId,
      startDate: announcement.startDate,
      endDate: announcement.endDate,
      announcementText: announcement.announcementText
    },
    data: {
        "id": announcement.id,
        "commonsId": announcement.commonsId,
        "startDate": announcement.startDate,
        "endDate": announcement.endDate,
        "announcementText": announcement.announcementText,
    }
  });

  const onSuccess = (_, announcement) => {
    toast(`Announcement Updated - id: ${announcement.id}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/announcements?id=${id}`]
  );

  const { isSuccess } = mutation

  const submitAction = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to= '/'/>
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Announcement {id}</h1>
        {announcement &&
          <AnnouncementForm initialContents={announcement} submitAction={submitAction} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}


