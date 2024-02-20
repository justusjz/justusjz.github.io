import { z } from 'zod';

export interface Env {
	DB: D1Database;
}

const RequestType = z.object({
	author: z.string(),
	content: z.string(),
});

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const url = new URL(request.url);
		const postId = url.searchParams.get('post');
		if (!postId) {
			return new Response('Missing post parameter', {
				status: 400,
				headers: {
					'access-control-allow-origin': '*',
				},
			});
		}
		if (request.method == 'GET') {
			const comments = await env.DB.prepare(
				'SELECT author, content FROM Comment WHERE postId = ?'
			)
				.bind(postId)
				.all();
			return Response.json(comments.results, {
				headers: {
					'access-control-allow-origin': '*',
				},
			});
		} else if (request.method == 'POST') {
			const body = RequestType.parse(await request.json());
			if (body.author.length < 1 || body.content.length < 1) {
				return new Response('Author and content must not be empty.', {
					status: 400,
					headers: {
						'access-control-allow-origin': '*',
					},
				});
			}
			await env.DB.prepare(
				'INSERT INTO Comment (postId, author, content) VALUES (?, ?, ?)'
			)
				.bind(postId, body.author, body.content)
				.run();
			return new Response('Success', {
				headers: {
					'access-control-allow-origin': '*',
				},
			});
		} else {
			return new Response('Invalid method', {
				status: 405,
				headers: {
					'access-control-allow-origin': '*',
				},
			});
		}
	},
};
