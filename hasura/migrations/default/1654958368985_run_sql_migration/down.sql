-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE FUNCTION public.artwork_comments(artwork_row artworks)
--  RETURNS comments
--  LANGUAGE sql
--  STABLE
-- AS $function$
-- SELECT comments.* FROM comments JOIN editions ON comments.edition_id = editions.id WHERE editions.artwork_id = artwork_row.id
-- $function$;