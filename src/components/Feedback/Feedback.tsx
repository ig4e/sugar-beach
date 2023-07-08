import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";
import { Rating, Spoiler } from "@mantine/core";
import type { User, UserFeedback } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function Feedback({ feedback }: { feedback: UserFeedback & { user: User } }) {
  const isFeedbackEdited = feedback.updatedAt > feedback.createdAt;

  return (
    <HStack spacing={4} alignItems={"start"}>
      <Avatar
        src={feedback.user.image as string | undefined}
        name={feedback.user.name}
        size={"sm"}
      ></Avatar>
      <VStack alignItems={"start"}>
        <HStack>
          <span className="text-sm font-semibold">{feedback.user.name}</span>
          <span className="text-sm">{isFeedbackEdited ? "Edited " + dayjs(feedback.updatedAt).fromNow() : dayjs(feedback.updatedAt).fromNow()}</span>
        </HStack>

        <Spoiler hideLabel="Hide" showLabel="Show more" maxHeight={120}>
          <Text>{feedback.content}</Text>
        </Spoiler>
        <Rating readOnly value={feedback.score} size="sm" color="pink"></Rating>
      </VStack>
    </HStack>
  );
}

export default Feedback;
