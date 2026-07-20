-- 1. Create Role Table
CREATE TABLE IF NOT EXISTS public.role
(
    id bigint NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT role_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL,
    password character varying(255) COLLATE pg_catalog."default",
    username character varying(255) COLLATE pg_catalog."default",
    role_id bigint,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT fk4qu1gr772nnf6ve5af002rwya FOREIGN KEY (role_id)
        REFERENCES public.role (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;

-- 3. Create Expense Group Table
CREATE TABLE IF NOT EXISTS public.expense_group
(
    id uuid NOT NULL,
    description character varying(255) COLLATE pg_catalog."default",
    name character varying(255) COLLATE pg_catalog."default",
    user_id uuid,
    CONSTRAINT expense_group_pkey PRIMARY KEY (id),
    CONSTRAINT fkou6m7q9098jymaejbiox6occy FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;

-- 4. Create Expense Table
CREATE TABLE IF NOT EXISTS public.expense
(
    id uuid NOT NULL,
    amount double precision NOT NULL,
    creation_time timestamp without time zone,
    description character varying(255) COLLATE pg_catalog."default",
    expense_group_id uuid,
    user_id uuid,
    CONSTRAINT expense_pkey PRIMARY KEY (id),
    CONSTRAINT fkekyts7i8w5cam119wj1itdom2 FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fknela9oeq8fkibex6xs93qtuft FOREIGN KEY (expense_group_id)
        REFERENCES public.expense_group (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;

-- 5. Create Income Group Table
CREATE TABLE IF NOT EXISTS public.income_group
(
    id uuid NOT NULL,
    description character varying(255) COLLATE pg_catalog."default",
    name character varying(255) COLLATE pg_catalog."default",
    user_id uuid,
    CONSTRAINT income_group_pkey PRIMARY KEY (id),
    CONSTRAINT fkh05q73et3ij14d1s84ycjr1y0 FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;

-- 6. Create Income Table
CREATE TABLE IF NOT EXISTS public.income
(
    id uuid NOT NULL,
    amount double precision NOT NULL,
    creation_time timestamp without time zone,
    description character varying(255) COLLATE pg_catalog."default",
    income_group_id uuid,
    user_id uuid,
    CONSTRAINT income_pkey PRIMARY KEY (id),
    CONSTRAINT fknuw53hk0hha02go6e3itfne7t FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fkt3jwvnmfvcxy1fbyraptwjpuu FOREIGN KEY (income_group_id)
        REFERENCES public.income_group (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
) TABLESPACE pg_default;