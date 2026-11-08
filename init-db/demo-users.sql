INSERT INTO users (username, password, istemporary, timecreated)
VALUES
  ('Christopher',  '$2b$10$1wL4ciqR3DEXK7FT0RkbtefRrvkcvdgTcUJ5gWF0BFwkJ5sVhLFES', false, floor(extract(epoch FROM now()) * 1000)::bigint),
  ('Spongebob',    '$2b$10$wGGKe2vqp58flwSC9/hyee8apKp47LrKcbvCNu7kZjp.1weI1C9ge', false, floor(extract(epoch FROM now()) * 1000)::bigint),
  ('Patrick',      '$2b$10$Vui/0UxuIbC.jqWHvochseugqdmbYQ.Rc8TmG0qfX.IQnnNLtDl4e', false, floor(extract(epoch FROM now()) * 1000)::bigint),
  ('WalterWhite',  '$2b$10$KVOjB8KHmdvZatxAIRwEfOp1uRFPf8O8vwJbfplucqjoV0P06TLce', false, floor(extract(epoch FROM now()) * 1000)::bigint),
  ('JessePinkman', '$2b$10$PPMml0E7mImzfLU2L8Hf9OGZxsrGwtmOvF4han5Bxf39stO1bJ5TC', false, floor(extract(epoch FROM now()) * 1000)::bigint),
  ('TonySoprano',  '$2b$10$ZxDsOQqAwZzc5gJ2eQ2wOu7y0l2cm6SRJRLN9M6S.RhM2ZzPz38vC', false, floor(extract(epoch FROM now()) * 1000)::bigint)
ON CONFLICT (username) DO UPDATE
SET password = EXCLUDED.password,
    istemporary = false;