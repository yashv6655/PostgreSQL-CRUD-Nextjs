import React from "react";
import { Box, Link, Flex, Button, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

interface NavBarProps {}

const Navbar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body = null;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2} colorScheme="green.400">
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link colorScheme="green.400">Register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex>
        <Box mr={4}>
          <Text fontSize="xl">{data.me.username}</Text>
        </Box>
        <NextLink href="/create-post">
          <Button colorScheme="green" ml="auto" size="sm">
            <Link>Create A Post</Link>
          </Button>
        </NextLink>
        <Button
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
          colorScheme="green"
          // variant="link"
          size="sm"
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="green.500" p={4} position="sticky" top={0} zIndex={1}>
      <NextLink href="/">
        <Link>
          <Text fontSize="2xl">Basically Reddit</Text>
        </Link>
      </NextLink>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default Navbar;
