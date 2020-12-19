import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import Layout from "../components/Layout";
// import Navbar from "../components/Navbar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables: variables,
  });

  if (!fetching && !data) {
    return <div>Failed to fetch posts</div>;
  }

  return (
    <Layout>
      <Flex>
        <Heading mb={5}>SSM</Heading>
        <NextLink href="/create-post">
          <Button colorScheme="green" ml="auto" mb={5}>
            <Link>Create Post</Link>
          </Button>
        </NextLink>
      </Flex>
      {fetching && !data ? (
        <div>Loading...</div>
      ) : (
        <Stack>
          {data?.posts.map((p) => (
            <Box p={p.id} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}...</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts[data.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={10}
            colorScheme="green"
          >
            Load More
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
