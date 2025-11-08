@{
    ViewData["Title"] = "Feil";
}

<h1 class="text-danger">Feil</h1>
<h2 class="text-danger">Det har oppstått en fel under behandling av din forespørsel</h2>

<hr />

@if (Model != null && !string.IsNullOrEmpty(Model.RequestId)){
    <p>
        <strong>Referanse-ID:</strong><code>@Model.RequestId</code>
    </p>
}

<h3>Utviklerinformasjon (Kun i produksjon)</h3>
<p>
    Kontakt systemadministrator. Denne informasjonen er logget.
</p>