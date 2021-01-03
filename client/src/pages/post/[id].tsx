import React from "react";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import Layout from "../../components/Layout";
import { Box, Button, Center, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";

const Post = ({}) => {
  const [{ data, fetching }] = useGetPostFromUrl();

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
          <Box mb={10}>{data?.post?.text}</Box>
          <EditDeletePostButtons
            id={data.post.id}
            creatorId={data.post.creator.id}
          />
        </Text>
      </Center>
      <Center>
        <NextLink href="/">
          <Link>
            <Button colorScheme="green">Back Home</Button>
          </Link>
        </NextLink>
      </Center>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
