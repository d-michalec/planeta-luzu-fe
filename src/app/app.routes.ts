import { Routes } from '@angular/router';
import { Landing } from './main/landing/landing';
import { Registration } from './main/registration/registration';
import { StaticPage } from './main/static-page/static-page';
import { Admin } from './admin/admin';
import { Headphones } from './admin/headphones/headphones.component';
import { Attendees } from './admin/attendees/attendees';
import { RegisteredUsers } from './admin/registered-users/registered-users';
import { AssignHeadphones } from './admin/assign-headphones/assign-headphones';
import { AdminLogin } from './admin/login/admin-login';
import { adminAuthGuard } from './admin/auth/admin-auth.guard';
import { AdminEvent } from './admin/event/admin-event';

export const routes: Routes = [
  { path: '', component: Landing },
  {
    path: 'regulamin',
    component: StaticPage,
    data: {
      eyebrow: 'Silent Disco Planeta Luzu',
      title: 'Regulamin imprezy',
      lead:
        'Regulamin określa zasady uczestnictwa w prywatnym wydarzeniu Silent Disco Planeta Luzu.',
      sections: [
        {
          title: '§1. Informacje ogólne',
          paragraphs: [
            'Impreza Silent Disco Planeta Luzu jest wydarzeniem prywatnym, organizowanym przez osobę fizyczną - Wiktorię Kirsz.',
            'Wydarzenie ma charakter zamknięty. Udział w imprezie jest możliwy wyłącznie po wcześniejszej rejestracji przez formularz online oraz otrzymaniu potwierdzenia udziału.',
            'Impreza odbędzie się w określonym miejscu i terminie podanym uczestnikom drogą elektroniczną po rejestracji. Niniejszy regulamin ma na celu zapewnienie bezpieczeństwa i komfortu wszystkim uczestnikom.',
          ],
        },
        {
          title: '§2. Uczestnictwo',
          paragraphs: ['Uczestnikiem imprezy może być wyłącznie osoba, która:'],
          items: [
            'ukończyła 18 lat lub uczestniczy za zgodą i pod opieką osoby dorosłej,',
            'zarejestrowała się przez stronę internetową,',
            'zaakceptowała regulamin i politykę prywatności,',
            'otrzymała potwierdzenie udziału.',
            'Organizator zastrzega sobie prawo do odmowy udziału osobie, która nie spełnia powyższych warunków.',
          ],
        },
        {
          title: '§3. Zasady podczas wydarzenia',
          paragraphs: ['Uczestnicy zobowiązani są do:'],
          items: [
            'zachowania kultury osobistej i szacunku wobec innych,',
            'nieprzeszkadzania innym w odbiorze wydarzenia,',
            'przestrzegania przepisów porządkowych obowiązujących w miejscu imprezy,',
            'niewnoszenia środków odurzających i nielegalnych substancji,',
            'unikania agresywnego, głośnego lub niebezpiecznego zachowania,',
            'niedewastowania sprzętu, w tym słuchawek, ani wyposażenia miejsca imprezy.',
          ],
        },
        {
          title: '§4. Odpowiedzialność',
          paragraphs: [
            'Uczestnik ponosi odpowiedzialność finansową za celowe uszkodzenie sprzętu lub wyposażenia, w tym słuchawek. W przypadku uszkodzenia lub zagubienia słuchawek obowiązuje opłata w wysokości 800 zł za sztukę.',
            'Organizator nie ponosi odpowiedzialności za rzeczy pozostawione bez nadzoru ani za skutki działań uczestników niezgodnych z regulaminem. Udział w wydarzeniu odbywa się na własną odpowiedzialność uczestnika.',
          ],
        },
        {
          title: '§5. Sprzęt i słuchawki',
          paragraphs: [
            'Podczas wydarzenia uczestnikom zostaną wypożyczone słuchawki niezbędne do udziału w Silent Disco.',
            'Warunkiem otrzymania słuchawek jest okazanie kodu QR otrzymanego drogą elektroniczną po zatwierdzeniu rejestracji przez Organizatora.',
            'Uczestnik zobowiązany jest do zwrotu słuchawek w nienaruszonym stanie po zakończeniu imprezy.',
          ],
        },
        {
          title: '§6. Rejestracja danych i prywatność',
          paragraphs: [
            'Podczas rejestracji zbierane są dane osobowe uczestników, np. imię, adres e-mail i numer telefonu, wyłącznie w celu organizacji wydarzenia.',
            'Szczegóły dotyczące przetwarzania danych osobowych znajdują się w Polityce Prywatności dostępnej na stronie wydarzenia. Rejestracja i udział w wydarzeniu oznaczają akceptację tego regulaminu oraz polityki prywatności.',
          ],
        },
        {
          title: '§7. Zmiany i kontakt',
          paragraphs: [
            'Organizator zastrzega sobie prawo do wprowadzenia zmian w regulaminie oraz harmonogramie imprezy. Uczestnicy zostaną o tym poinformowani mailowo lub na stronie wydarzenia.',
            'Wszelkie pytania można kierować do Organizatora na adres e-mail planetaluzu.sd@gmail.com.',
          ],
        },
      ],
    },
  },
  {
    path: 'polityka-prywatnosci',
    component: StaticPage,
    data: {
      eyebrow: 'Silent Disco Planeta Luzu',
      title: 'Polityka prywatności',
      lead:
        'Informacje o tym, jakie dane są zbierane przez formularz rejestracyjny i w jakim celu są przetwarzane.',
      sections: [
        {
          title: '1. Informacje ogólne',
          paragraphs: [
            'Niniejsza polityka prywatności dotyczy danych osobowych zbieranych za pośrednictwem strony internetowej oraz formularza rejestracyjnego dotyczącego prywatnej imprezy organizowanej przez Wiktorię Kirsz, dalej: Organizatorka.',
            'Strona oraz formularz służą wyłącznie do rejestracji uczestników wydarzenia, weryfikacji tożsamości przy odbiorze sprzętu i nie mają charakteru komercyjnego.',
          ],
        },
        {
          title: '2. Administrator danych',
          paragraphs: [
            'Administratorem danych osobowych jest Wiktoria Kirsz. Kontakt w sprawach związanych z przetwarzaniem danych: planetaluzu.sd@gmail.com.',
          ],
        },
        {
          title: '3. Zakres zbieranych danych',
          paragraphs: [
            'Zbieramy tylko te dane, które dobrowolnie podasz w formularzu rejestracyjnym: imię i nazwisko, adres e-mail oraz numer telefonu.',
            'Dane te są zbierane wyłącznie w celu organizacji imprezy, weryfikacji listy gości przy wydawaniu słuchawek oraz bieżącego kontaktu z uczestnikami.',
          ],
        },
        {
          title: '4. Podstawa prawna i okres przetwarzania danych',
          paragraphs: [
            'Dane osobowe przetwarzane są na podstawie art. 6 ust. 1 lit. b RODO, ponieważ przetwarzanie jest niezbędne do realizacji zgłoszenia udziału w imprezie i wykonania postanowień Regulaminu, w tym weryfikacji kodu QR przy odbiorze słuchawek.',
            'Dane osobowe przetwarzane są także na podstawie art. 6 ust. 1 lit. f RODO, czyli prawnie uzasadnionego interesu Organizatorki, polegającego na zabezpieczeniu ewentualnych roszczeń finansowych w przypadku uszkodzenia lub zagubienia wypożyczonego sprzętu.',
            'Dane będą przechowywane wyłącznie przez okres niezbędny do realizacji i rozliczenia wydarzenia. Wszystkie dane zostaną trwale usunięte z bazy w ciągu 14 dni od dnia zakończenia imprezy.',
          ],
        },
        {
          title: '5. Bezpieczeństwo i udostępnianie danych',
          paragraphs: [
            'Dbamy o bezpieczeństwo Twoich danych. Nie przekazujemy ich podmiotom trzecim, nie sprzedajemy i nie udostępniamy w celach marketingowych.',
            'Dostęp do zebranych danych ma wyłącznie Organizatorka. Dane są przechowywane przy użyciu bezpiecznych narzędzi cyfrowych, chronionych hasłem.',
          ],
        },
        {
          title: '6. Twoje prawa',
          paragraphs: ['Zgodnie z przepisami RODO, w każdym momencie masz prawo do:'],
          items: [
            'dostępu do treści swoich danych oraz otrzymania ich kopii,',
            'sprostowania lub uzupełnienia danych,',
            'żądania usunięcia danych, czyli prawa do bycia zapomnianym,',
            'ograniczenia przetwarzania danych,',
            'kontaktu w celu realizacji swoich praw pod adresem: planetaluzu.sd@gmail.com.',
          ],
        },
        {
          title: '7. Ciasteczka i linki zewnętrzne',
          paragraphs: [
            'Na stronie mogą pojawiać się linki do zewnętrznych serwisów, np. mapy z lokalizacją wydarzenia. Organizatorka nie ponosi odpowiedzialności za polityki prywatności oraz zasady ochrony danych stosowane przez te serwisy.',
            'Strona nie korzysta z zaawansowanych plików cookies do śledzenia lub profilowania użytkowników.',
          ],
        },
        {
          title: '8. Zmiany w polityce prywatności',
          paragraphs: [
            'Polityka prywatności może być aktualizowana w przypadku zmian w przepisach prawa lub zmian organizacyjnych dotyczących wydarzenia. O wszelkich modyfikacjach uczestnicy zostaną poinformowani na stronie wydarzenia lub drogą mailową.',
          ],
        },
      ],
    },
  },
  { path: 'registration', component: Registration },
  { path: 'admin/login', component: AdminLogin },
  {
    path: 'admin',
    component: Admin,
    canActivate: [adminAuthGuard],
    canActivateChild: [adminAuthGuard],
    children: [
      { path: '', redirectTo: 'headphones', pathMatch: 'full' },
      { path: 'attendees', component: Attendees },
      { path: 'headphones', component: Headphones },
      { path: 'event', component: AdminEvent },
      { path: 'registration', component: RegisteredUsers },
      { path: 'assign-headphones', component: AssignHeadphones
      }
    ],
  },
];
