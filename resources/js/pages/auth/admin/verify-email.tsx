// Composants
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout
            title="Vérification d'email"
            description="Veuillez vérifier votre adresse email en cliquant sur le lien que nous venons de vous envoyer par email."
        >
            <Head title="Vérification d'email" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Un nouveau lien de vérification a été envoyé à l'adresse email que vous avez fournie lors de l'inscription.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button disabled={processing} variant="secondary">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Renvoyer l'email de vérification
                </Button>

                <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
                    Se déconnecter
                </TextLink>
            </form>
        </AuthLayout>
    );
}
