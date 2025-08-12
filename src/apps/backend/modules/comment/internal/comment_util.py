from typing import Any

from modules.comment.errors import CommentTaskNotFoundError
from modules.comment.internal.store.comment_model import CommentModel
from modules.comment.types import Comment
from modules.task.errors import TaskNotFoundError
from modules.task.task_service import TaskService
from modules.task.types import GetTaskParams


class CommentUtil:
    @staticmethod
    def convert_comment_bson_to_comment(comment_bson: dict[str, Any]) -> Comment:
        validated_comment_data = CommentModel.from_bson(comment_bson)

        return Comment(
            account_id=validated_comment_data.account_id,
            content=validated_comment_data.content,
            id=str(validated_comment_data.id),
            task_id=validated_comment_data.task_id,
            created_at=validated_comment_data.created_at.isoformat() if validated_comment_data.created_at else "",
            updated_at=validated_comment_data.updated_at.isoformat() if validated_comment_data.updated_at else "",
        )

    @staticmethod
    def validate_task_exists(account_id: str, task_id: str) -> None:
        try:
            task_params = GetTaskParams(account_id=account_id, task_id=task_id)
            TaskService.get_task(params=task_params)
        except TaskNotFoundError:
            raise CommentTaskNotFoundError(task_id=task_id)

        return
