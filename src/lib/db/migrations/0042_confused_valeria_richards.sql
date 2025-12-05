CREATE INDEX "idx_notifikasi_user_id" ON "notifikasi" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_notifikasi_created_at" ON "notifikasi" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_notifikasi_read" ON "notifikasi" USING btree ("read");--> statement-breakpoint
CREATE INDEX "idx_notifikasi_user_read_created" ON "notifikasi" USING btree ("user_id","read","created_at");