import { ArrowRightCircleIcon, CheckIcon } from "@heroicons/react/24/outline";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import { signIn } from "next-auth/react";

import { ActionButton, Button } from "@app/components/Button";
import { Logo } from "@app/components/Logo";
import { getSession, getUserFromSession } from "@app/lib/auth";
import { classNames, communityApps } from "@app/lib/utils";

const { GA_TRACKING_ID = "" } = process.env;

export const getServerSideProps: GetServerSideProps<{
  gaTrackingId: string;
}> = async (context) => {
  const session = await getSession(context.req, context.res);
  const user = await getUserFromSession(session);

  if (user && user.workspaces.length > 0) {
    // TODO(spolu): persist latest workspace in session?
    let url = `/w/${user.workspaces[0].sId}/a`;
    if (context.query.wId) {
      url = `/api/login?wId=${context.query.wId}`;
    }
    if (context.query.inviteToken) {
      url = `/api/login?inviteToken=${context.query.inviteToken}`;
    }
    return {
      redirect: {
        destination: url,
        permanent: false,
      },
    };
  }

  return {
    props: { gaTrackingId: GA_TRACKING_ID },
  };
};

const features = [
  {
    name: "Chained LLM apps",
    built: true,
    description:
      "Chain arbitrarily between calls to models, code execution and queries to external services.",
  },
  {
    name: "Multiple inputs",
    built: true,
    description:
      "Avoid overfitting by iterating on your LLM app design on several inputs simultaneously.",
  },
  {
    name: "Model choice",
    built: true,
    description:
      "Design against models served by OpenAI, Cohere, AI21 and more. Switch models seamlessly.",
  },
  {
    name: "Version history",
    built: true,
    description:
      "Have easy access to iterations, model outputs and few-shot examples saved automatically.",
  },
  {
    name: "Caching",
    built: true,
    description:
      "Speed up iterations and reduce costs with cached model interactions.",
  },
  {
    name: "Easy deployment & use",
    built: true,
    description: "Deploy to an API endpoint or use directly from Dust.",
  },
  {
    name: "Data Sources",
    built: true,
    description:
      "Fully managed semantic search engines you can query from your workflows.",
  },
  {
    name: "Connections",
    built: false,
    description:
      "Connect your team's Notion, Google Docs or Slack to managed Data Sources that are kept up-to-date automatically.",
  },
];

function Features() {
  return (
    <div className="mx-auto max-w-3xl xl:max-w-7xl">
      <div className="mx-auto text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Build powerful workflows <br />
          on top of LLMs and Semantic Search🔥
        </h2>
      </div>
      <div className="px-4 py-16 sm:px-6 xl:px-8 xl:py-24">
        <dl className="space-y-10 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 xl:grid-cols-4 xl:gap-x-8">
          {features.map((feature) => (
            <div key={feature.name} className="relative">
              <dt>
                <CheckIcon
                  className="absolute h-6 w-6 text-green-500"
                  aria-hidden="true"
                />
                <p className="ml-9 flex flex-row items-center text-lg font-medium leading-6 text-gray-900">
                  <span>{feature.name}</span>
                  {feature.built ? null : (
                    <span className="ml-2 rounded-md bg-gray-400 px-2 py-0.5 text-xs font-normal text-white">
                      coming soon
                    </span>
                  )}
                </p>
              </dt>
              <dd className="ml-9 mt-2 text-base text-gray-500">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function Home({
  gaTrackingId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Dust - Design and Deploy Large Language Models Apps</title>
        <link rel="shortcut icon" href="/static/favicon.png" />
      </Head>

      <main className="mx-4">
        <div className="mx-8">
          <Logo />
        </div>

        <div className="mx-auto mt-12 sm:max-w-3xl lg:max-w-4xl">
          <h1 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            <div className="">Make and Deploy</div>
            <div className="leading-snug text-violet-600">
              Large Language Model Apps
            </div>
          </h1>

          <div className="mt-8 flex flex-col">
            {!router.query.signIn || router.query.signIn === "github" ? (
              <div className="flex w-auto w-full flex-initial">
                <div className="mx-auto mt-2">
                  <ActionButton
                    onClick={() =>
                      signIn("github", {
                        callbackUrl: router.query.wId
                          ? `/api/login?wId=${router.query.wId}`
                          : `/api/login`,
                      })
                    }
                  >
                    <img
                      src="/static/github_white_32x32.png"
                      className="ml-1 h-4 w-4"
                    />
                    <span className="ml-2 mr-1">Sign in with GitHub</span>
                  </ActionButton>
                </div>
              </div>
            ) : null}

            {!router.query.signIn || router.query.signIn === "google" ? (
              <div className="flex w-auto w-full flex-initial">
                <div className="mx-auto mt-2">
                  <ActionButton
                    onClick={() =>
                      signIn("google", {
                        callbackUrl: router.query.wId
                          ? `/api/login?wId=${router.query.wId}`
                          : `/api/login`,
                      })
                    }
                  >
                    <img
                      src="/static/google_white_32x32.png"
                      className="ml-1 h-4 w-4"
                    />
                    <span className="ml-2 mr-1">Sign in with Google</span>
                  </ActionButton>
                </div>
              </div>
            ) : null}

            <div className="flex w-auto w-full flex-initial">
              <div className="mx-auto mt-3">
                <Link href="https://docs.dust.tt" className="mx-auto">
                  <div className="">
                    <Button>
                      <ArrowRightCircleIcon className="-ml-1 mr-2 h-4 w-4" />
                      View Documentation
                    </Button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Features />
        </div>

        <div className="mx-auto mt-8 max-w-4xl space-y-4 divide-y divide-gray-200 px-6">
          <div className="sm:flex sm:items-center">
            <div className="mt-8 sm:flex-auto">
              <h1 className="text-base font-medium text-gray-900">
                Community Example Apps
              </h1>

              <p className="text-sm text-gray-500">
                Discover apps created by the community. They serve as great
                examples to get started with Dust.
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden">
            <ul role="list" className="mb-8">
              {communityApps.map((app) => (
                <li key={app.sId} className="px-2">
                  <div className="py-4">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/w/${app.wId}/a/${app.sId}`}
                        className="block"
                      >
                        <p className="truncate text-base font-bold text-violet-600">
                          {app.name}
                        </p>
                      </Link>
                      <div className="ml-2 flex flex-shrink-0">
                        <p
                          className={classNames(
                            "inline-flex rounded-full px-2 text-xs font-semibold leading-5",
                            app.visibility == "public"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          )}
                        >
                          {app.visibility}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-700">
                          {app.description}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-300 sm:mt-0">
                        <p>{app.sId}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto my-10 max-w-3xl text-center text-sm text-gray-400">
          Dust © 2022 – 2023
        </div>
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
             window.dataLayer = window.dataLayer || [];
             function gtag(){window.dataLayer.push(arguments);}
             gtag('js', new Date());

             gtag('config', '${gaTrackingId}');
            `}
          </Script>
        </>
      </main>
    </>
  );
}
