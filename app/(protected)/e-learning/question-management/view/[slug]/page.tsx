import { Breadcrumb } from "@/components/breadcrumb";
import { DashboardIcon } from "@radix-ui/react-icons";

import { ELearnQuestionIcon } from "@/components/icon";
import { API, ApiResponse } from "@/lib/fetch";
import { notFound } from "next/navigation";
import QuestionSetForm from "../../components/question-form";

const getDetailsBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<ApiResponse> => {
  const res = await API.Get(`learning_question_set/find`, {
    where: { uid: slug },
    populate: ["questions", "questions.options"],
  });
  return res;
};

export default async function ContactUsManagement({
  params,
}: {
  params: { slug: string };
}) {
  const { error, data, statusCode } = await getDetailsBySlug({
    slug: params.slug,
  });
  if (error && statusCode === 404) {
    return notFound();
  }
  return (
    <>
      <Breadcrumb
        breadcrumbs={[
          {
            title: "Dashboard",
            link: "/",
            icon: DashboardIcon,
            active: false,
          },
          {
            title: "Question Management",
            icon: ELearnQuestionIcon,
            active: true,
          },
        ]}
      />
      <div>
        <section className="lg:m-10 m-5 flex flex-col flex-grow space-y-2">
          <div className="container  p-0">
            <h2 className="text-2xl font-bold tracking-tight ml-2">
              Question Set
            </h2>
            <QuestionSetForm item={data?.learning_question_set} />
          </div>
        </section>
      </div>
    </>
  );
}
