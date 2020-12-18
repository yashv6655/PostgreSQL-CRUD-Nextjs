import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/inputField";
import Layout from "../components/Layout";
// import Wrapper from "../components/Wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();

  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          console.log(values);
          const { error } = await createPost({ input: values });
          if (!error) {
            alert("Generated Post");
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="Title of the new post"
              label="Title"
            />
            <Box mt={4}>
              <InputField
                name="text"
                placeholder="Body of the post"
                label="Body"
                type="text"
                textarea
              />
            </Box>
            <Button
              type="submit"
              isLoading={isSubmitting}
              colorScheme="green"
              mr={10}
              mt={4}
            >
              Generate
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
