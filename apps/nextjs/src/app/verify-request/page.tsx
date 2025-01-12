import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";

export default function VerifyRequestPage() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl">
            Cheque seu email
          </CardTitle>
        </CardHeader>
        <CardContent>
          Um link de login foi enviado para seu endereço de email.
        </CardContent>
      </Card>
    </main>
  );
}
