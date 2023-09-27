import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete QuestionComment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment()
    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    await sut.execute({
      questionCommentId: newQuestionComment.id.toString(),
      authorId: newQuestionComment.authorId.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it.skip('should not be able to delete a question comment from another user', async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    })
    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    expect(() => {
      return sut.execute({
        questionCommentId: newQuestionComment.id.toString(),
        authorId: 'author-2',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
