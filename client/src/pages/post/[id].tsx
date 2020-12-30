import React from "react";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import Layout from "../../components/Layout";
import { Box, Center, Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;

  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (fetching) {
    return (
      <Layout>
        <div>Loading</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Heading>Post Not Found</Heading>
      </Layout>
    );
  }

  return (
    <Layout>
      <Center>
        <Heading fontSize="3xl" mb={2}>
          {data?.post?.title}
        </Heading>
      </Center>
      <Center>
        <Text mb={4} fontSize="xs">
          Creator: {data?.post?.creator.username}
        </Text>
      </Center>

      <Center>
        <Text fontSize="2xl" mb={5}>
          {data?.post?.text}
        </Text>
      </Center>
      <Center>
        <NextLink href="/">
          <Link>Back Home</Link>
        </NextLink>
      </Center>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
