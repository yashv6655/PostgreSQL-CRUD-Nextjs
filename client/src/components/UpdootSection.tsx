import React, { useState } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("updoot-loading");
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "updoot-loading"}
        variant="outline"
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        aria-label="updoot post"
        icon={<TriangleUpIcon />}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("downdoot-loading");
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
        variant="outline"
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        aria-label="downdoot post"
        icon={<TriangleDownIcon />}
      />
    </Flex>
  );
};
