CREATE TABLE IF NOT EXISTS "goals_completed" (
	"id" text PRIMARY KEY NOT NULL,
	"goals_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "goals" ADD PRIMARY KEY ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goals_completed" ADD CONSTRAINT "goals_completed_goals_id_goals_id_fk" FOREIGN KEY ("goals_id") REFERENCES "public"."goals"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
